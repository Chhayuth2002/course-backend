const Course = require('../models/Course')
const Chapter = require('../models/Chapter')
const Lesson = require('../models/Lesson')
const Tag = require('../models/Tag')
const CourseTag = require('../models/CourseTag')

const getAllCourse = (req, res) => {
  try {
    Course.query()
      .withGraphJoined('[chapters.[lessons], tags]')
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const getOneCourse = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.query().findById(id)

    if (!course) res.json({ msg: 'Course not found' })
  } catch (error) {
    res.json({ error: error.message })
  }
}

const createCourse = async (req, res) => {
  try {
    const data = req.body

    const course = await Course.query().insert({
      name: data.name,
      summary: data.summary,
      category_id: data.category_id,
      image_url: data.image_url
    })

    // Add tags
    const tagsParam = data.tags
      .filter(tag => tag.__isNew__)
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
      if (!tagData.__isNew__) {
        await CourseTag.query().insert({
          course_id: course.id,
          tag_id: tagData.value
        })
      }
    }

    for (const chapterData of data.chapters) {
      const chapter = await Chapter.query().insert({
        name: chapterData.name,
        summary: chapterData.summary,
        course_id: course.id
      })
      for (const lessonData of chapterData.lessons) {
        await Lesson.query().insert({
          name: lessonData.name,
          content: lessonData.content,
          image_url: lessonData.image_url,
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
  }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const course = await Course.query().patchAndFetchById(id, {
      name: data.name,
      summary: data.summary,
      image_url: data.image_url
    })

    if (!course) return res.json({ msg: 'course not found' })

    // Remove tags
    const removeTagIds = data.tags
      .filter(tag => tag._delete && tag.id)
      .map(tag => tag.id)

    if (removeTagIds.length > 0) {
      await CourseTag.query()
        .where('course_id', course.id)
        .whereIn('tag_id', removeTagIds)
        .delete()
    }

    const updateTag = data.tags.filter(
      tag => tag.id && !tag._delete && !tag.__isNew__
    )

    console.log(updateTag)

    for (const update of updateTag) {
      await CourseTag.query().insert({
        course_id: course.id,
        tag_id: update.id
      })
    }

    // Add tags
    const tagsParam = data.tags.filter(tag => !tag.id).name

    if (tagsParam) {
      const tags = await Tag.query().insert(tagsParam)

      const courseTagParam = tags.map(tag => ({
        tag_id: tag.id,
        course_id: course.id
      }))
      await CourseTag.query().insert(courseTagParam)
    }

    // Remove chapters
    const removeChapterIds = data.chapters
      .filter(chapter => chapter._delete && chapter.id)
      .map(chapter => chapter.id)

    if (removeChapterIds) {
      await Chapter.query()
        .where('course_id', course.id)
        .whereIn('id', removeChapterIds)
        .delete()

      await Lesson.query().whereIn('chapter_id', removeChapterIds).delete()
    }

    for (const chapterData of data.chapters) {
      let chapter
      if (chapterData.id && !chapterData._delete) {
        // Update existing chapter
        chapter = await Chapter.query().patchAndFetchById(chapterData.id, {
          name: chapterData.name,
          summary: chapterData.summary,
          course_id: course.id
        })
      }

      if (chapterData.__isNew__) {
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
          .filter(lesson => lesson.id && lesson._delete)
          .map(lesson => lesson.id)

        if (removeLessonIds) {
          await Lesson.query()
            .where('chapter_id', chapter.id)
            .whereIn('id', removeLessonIds)
            .delete()
        }

        for (const lessonData of chapterData.lessons) {
          if (lessonData.id && !lessonData._delete && !lessonData.__isNew__) {
            // Update existing lesson
            await Lesson.query().findById(lessonData.id).patch({
              name: lessonData.name,
              content: lessonData.content,
              image_url: lessonData.image_url,
              chapter_id: chapter.id
            })
          }

          if (lessonData.__isNew__) {
            // Add new lesson
            await Lesson.query().insert({
              name: lessonData.name,
              content: lessonData.content,
              image_url: lessonData.image_url,
              chapter_id: chapter.id
            })
          }
        }
      }
    }

    const result = await Course.query()
      .findById(id)
      .withGraphJoined('[chapters.[lessons], tags]')

    res.json(result)
  } catch (error) {
    res.json({ error: error.message })
  }
}

const deleteCourse = (req, res) => {
  try {
    const { id } = req.params

    Course.query()
      .deleteById(id)
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const convertToDeleteValue = value => {
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
  getAllCourse,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse
}
