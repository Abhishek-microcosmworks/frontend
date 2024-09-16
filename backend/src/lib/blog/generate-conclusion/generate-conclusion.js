import OpenAI from "openai";

export async function generateConclusion(content) {
  const openai = new OpenAI();

  try {
    const prompt = `Combine content:${content} create a new conclusion for a blog strictly create a conclusion part for the blog nothing else nothing else. Also keep the writing style as the content provided.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Combine all the data and make a new conclusion for the blog only conclusion nothing else`,
        },
        { role: "user", content: prompt },
        {
          role: "assistant",
          content: `Divide the blog into sections.`,
        },
      ],
    });
    // Extract the generated introduction from the response
    const newConclusion = response.choices[0].message.content;

    return { error: false, data: newConclusion };

    //return generatedIntroduction;
  } catch (error) {
    // Handle any errors that may occur during the API call
    console.error("Error generating conclusion:", error);

    return { error: true, message: "Error while generating conclusion." };
  }
}
