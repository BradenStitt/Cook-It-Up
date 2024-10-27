import OpenAI from "openai";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getRecipeRecommendations(ingredients: string[], preferences: any) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful cooking assistant that provides recipe recommendations based on available ingredients and dietary preferences.",
        },
        {
          role: "user",
          content: `Generate a recipe recommendation based on these ingredients: ${ingredients.join(
            ", "
          )}. 
                   Dietary preferences: ${JSON.stringify(preferences)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (content === null) {
      throw new Error("Received null content from OpenAI API");
    }
    return JSON.parse(content);
  }
}
