const Course = require('../models/Course')
const Chapter = require('../models/Chapter')
const Lesson = require('../models/Lesson')
const Tag = require('../models/Tag')
const CourseTag = require('../models/CourseTag')

const list = (req, res) => {
  try {
    Course.query()
      .withGraphJoined('[chapters.[lessons], tags]')
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query()
      .findById(id)
      .withGraphJoined('[chapters.[lessons], tags]')

    if (!course) res.json({ msg: 'Course not found' })

    res.json(course)
  } catch (error) {
    res.json({ error: error.message })
  }
}

const create = async (req, res) => {
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  const data = req.body
  const file = req.files

  console.log(file)
  try {
    const course = await Course.query().insert({
      name: data.name,
      summary: data.summary,
      category_id: data.category_id,
      image_url: file[0].fieldname ==="image_url" ?`${basePath}${file[0].filename}` : null
    })

    // Add tags
    const tagsParam = data.tags
      .filter(tag => convert(tag.__isNew__))
      .map(tag => ({ name: tag.label }))

    if (tagsParam.length > 0) {
      const tags = await Tag.query().insert(tagsParam)

      const courseTagParam = tags.map(tag => ({
        tag_id: tag.id,
        course_id: course.id
      }))

      await CourseTag.query().insert(courseTagParam)
    }

    for (const tagData of data.tags) {
      if (!convert(tagData.__isNew__)) {
        await CourseTag.query().insert({
          course_id: course.id,
          tag_id: tagData.value
        })
      }
    }

    let fileIndex = file[0].fieldname === "image_url" ? 1 : 0

    for (let i = 0; i < data.chapters.length; i++) {
      const chapter = await Chapter.query().insert({
        name: data.chapters[i].name,
        summary: data.chapters[i].summary,
        course_id: course.id
      })

      for (let j = 0; j < data.chapters[i].lessons.length; j++) {
        const lessonFileIndex = fileIndex++
        let fileName

        if (file) {
          const expectedFieldName = `chapters[${i}][lessons][${j}][image_url]`
          console.log(expectedFieldName)
          if (file[lessonFileIndex]?.fieldname === expectedFieldName) {
            fileName = `${basePath}${file[lessonFileIndex].filename}`
          }
        }

        await Lesson.query().insert({
          name: data.chapters[i].lessons[j].name,
          content: data.chapters[i].lessons[j].content,
          image_url: fileName,
          chapter_id: chapter.id
        })
      }
    }

    const result = await Course.query()
      .findById(course.id)
      .withGraphJoined('[chapters.[lessons], tags]')

    res.json(result)
  } catch (error) {
    res.json({ error: error.message })
    console.log(error)
  }
}

const update = async (req, res) => {
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  const { id } = req.params
  const data = req.body
  const file = req.files
  try {

    const course = await Course.query().patchAndFetchById(id, {
      name: data.name,
      summary: data.summary,
      image_url:
        file[0]?.fieldname === 'image_url' ?`${basePath}${ file[0].filename}` : data.image_url
    })

    if (!course) return res.json({ msg: 'course not found' })

    // Remove tags
    const removeTagIds = data.tags
      .filter(tag => convert(tag._delete) && tag.id)
      .map(tag => tag.id)

    if (removeTagIds.length > 0) {
      await CourseTag.query()
        .where('course_id', course.id)
        .whereIn('tag_id', removeTagIds)
        .delete()
    }

    // Update tag
    const updateTag = data.tags.filter(
      tag => tag.id && !convert(tag._delete) && !convert(tag.__isNew__)
    )

    if (updateTag.length > 0) {
      for (const update of updateTag) {
        await CourseTag.query().insert({
          course_id: course.id,
          tag_id: update.id
        })
      }
    }

    // Add new tags
    const tagsParam = data.tags
      .filter(tag => !tag.id)
      .map(tag => ({ name: tag.name }))

    if (tagsParam.length > 0) {
      const tags = await Tag.query().insert(tagsParam)

      tags.forEach(async tag => {
        await CourseTag.query().insert({
          tag_id: tag.id,
          course_id: course.id
        })
      })
    }

    // Remove chapters
    const removeChapterIds = data.chapters
      .filter(chapter => convert(chapter._delete) && chapter.id)
      .map(chapter => chapter.id)

    if (removeChapterIds.length > 0) {
      await Chapter.query()
        .where('course_id', course.id)
        .whereIn('id', removeChapterIds)
        .delete()

      await Lesson.query().whereIn('chapter_id', removeChapterIds).delete()
    }

    let fileIndex = file[0]?.fieldname === 'image_url' ? 1 : 0

    data.chapters.forEach(async (chapterData, i) => {
      let chapter
      if (chapterData.id && !convert(chapterData._delete)) {
        // Update existing chapter
        chapter = await Chapter.query().patchAndFetchById(chapterData.id, {
          name: chapterData.name,
          summary: chapterData.summary,
          course_id: course.id
        })
      }

      if (!chapterData.id) {
        // Add new chapter
        chapter = await Chapter.query().insert({
          name: chapterData.name,
          summary: chapterData.summary,
          course_id: course.id
        })
      }

      if (chapter) {
        // Remove lesson
        const removeLessonIds = chapterData.lessons
          .filter(lesson => lesson.id && convert(lesson._delete))
          .map(lesson => lesson.id)

        if (removeLessonIds) {
          await Lesson.query()
            .where('chapter_id', chapter.id)
            .whereIn('id', removeLessonIds)
            .delete()
        }

        chapterData.lessons.forEach(async (lessonData, j) => {
          const lessonFileIndex = fileIndex++
          let fileName

          if (file) {
            const expectedFieldName = `chapters[${i}][lessons][${j}][image_url]`
            console.log(expectedFieldName)
            if (file[lessonFileIndex]?.fieldname === expectedFieldName) {
              fileName = `${basePath}${file[lessonFileIndex].filename}`
            }
          }

          if (lessonData?.image_url?.startsWith('http')) {
            fileName = lessonData.image_url
          }

          if (lessonData.id && !convert(lessonData._delete)) {
            // Update existing lesson
            await Lesson.query().findById(lessonData.id).patch({
              name: lessonData.name,
              content: lessonData.content,
              image_url: fileName,
              chapter_id: chapter.id
            })
          }

          if (!lessonData.id) {
            // Add new lesson
            await Lesson.query().insert({
              name: lessonData.name,
              content: lessonData.content,
              image_url: fileName,
              chapter_id: chapter.id
            })
          }
        })
      }
    })

    const result = await Course.query()
      .findById(id)
      .withGraphJoined('[chapters.[lessons], tags]')

    res.json(result)
  } catch (error) {
    res.json({ error: error.message })
    console.log(error)
  }
}

const destroy = (req, res) => {
  try {
    const { id } = req.params

    Course.query()
      .deleteById(id)
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const convert = value => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const lowerCaseValue = value.toLowerCase()
    if (lowerCaseValue === 'true') {
      return true
    } else if (lowerCaseValue === 'false') {
      return false
    }
  }

  return Boolean(value)
}

module.exports = {
  list,
  show,
  create,
  update,
  destroy
}
