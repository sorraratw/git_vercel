const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

module.exports = async function getVideos() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  }

  const { results } = await notion.request(payload)
  const resultsLength = results.length
  console.log(`Fetched ${resultsLength} videos from Notion`)
  const fname = results[0].properties.FullName.rich_text[0].text.content
  console.log(`First video title: ${fname}`)
  
  
  const videos = results.map((page) => {
    return {
      id: page.id,
      title: page.properties.FullName.rich_text[0].text.content,
      date: page.properties.AppointmentDate.date.start,
      tags: page.properties.AppointmentTime.rich_text[0].text.content,
      description: page.properties.Treatment.rich_text[0].text.content,
    }
  })

  return videos
}
