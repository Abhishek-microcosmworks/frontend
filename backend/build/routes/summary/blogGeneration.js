import OpenAI from 'openai';
import 'dotenv/config';
import { response } from 'express';
import { blog } from '../../db/model/index.js';
import { authenticationToken } from '../../db/model/index.js';
// import { verifyOtp } from './uploadLogin.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import json from 'body-parser';

export const blogGeneration = async (req, res) => {
  const context = req.body.context;
  const urls = req.body.urls || [];
  const email = req.body.email;

  let responsefinalContent;
  console.log(urls);
  console.log(`my url are :- ${urls} and blog Title is :- ${context} \n`);

  try {
    const responses = await Promise.all(urls.map(url => axios.get(url))); //mapping to scrap the content from each url
    const blogContent = [];
    for (const response of responses) {
      const data = response.data;
      const $ = cheerio.load(data);
      let wordCount = 0;
      $('p').map((_, element) => {
        const content = $(element).text();
        const words = content.split(' ');
        if (wordCount + words.length <= 800) {
          blogContent.push(content);
          wordCount += words.length;
        } else {
          return false;
        }
      });
    }
    const filteredContent = blogContent.filter(word => word.length <= 2500);
    const scrapContent = JSON.stringify(filteredContent);
    // console.log("blog", scrapContent);
    console.log('Cheerio ruuning successfull, blog scrapped \n ');
    const openai = new OpenAI();

    //  ****************generating blog based on context*****************

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: `Summarize a relevant blog on given ${context} in not more than 300 words`
      }, { role: 'user', content: context }, {
        role: 'assistant',
        content: 'sure, i will summarize the Blog for'
      }]
    });

    const responseText = completion.choices[0].message.content;

    console.log('my blog content is ', responseText);
    // const truncateScrapeMessage = scrapContent.substring(0, 2000);

    //  ****************generating blog based on Scrapped content from URLS*****************

    const scrapCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: ` blog content based on the each ${urls} provided in not more than 1000 words`
      }, { role: 'user', content: scrapContent }, {
        role: 'assistant',
        content: `sure, i will summarize the content based on the ${urls}.`
      }]
    });
    const responseScrapContent = scrapCompletion.choices[0].message.content;
    console.log('********************My scrapped content is ************************************* \n', responseScrapContent);

    const myContent = responseText + responseScrapContent;
    console.log('\n *********  my mixed content is *****************\n', myContent);
    // const truncateMyContent = myContent.substring(0, 4000);
    // console.log("\n my truncate Content is \n", truncateMyContent);

    //  ****************generating blog based on context response and Scrapped content from URLS*****************
    const finalContent = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: `Summarize the blog by generating contents based on ${responseText} and ${responseScrapContent} without plagarism`
      }, { role: 'user', content: responseText + responseScrapContent }, {
        role: 'assistant',
        content: 'sure, i will summarize the content based on the context'
      }]
    });
    responsefinalContent = finalContent.choices[0].message.content;
    console.log('\n**************************** my final content is ********************************** \n', responsefinalContent);

    // const image_generation = await openai.image.create({
    //   model: 'dall-e-3',
    //   prompt: 'a white siamese cat',
    //   n: 1,
    //   size: '1024x1024',
    // });
    // image_url = image_generation.data;
    // console.log(
    //   'image_url fot the content *************************************************\n',
    //   image_url,
    // );
    const blogData = await generateBlog(email, context, responsefinalContent
    // image_url,
    );

    res.status(200).json({
      message: 'Successfully Blog Generated',
      data: { blogData }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
    console.error(error);
  }
};
async function generateBlog(email, context, responsefinalContent) {
  try {
    const newBlog = new blog({
      email: email,
      title: context,
      // content: blogContent.join(" \n\n"),
      finalContent: responsefinalContent
    });

    const blogData = await blog.create(newBlog);
    console.log('Hi user database is generated for :- ', blogData);
    return blogData;
  } catch (error) {
    console.error('Error showing blog:', error);
  }
}