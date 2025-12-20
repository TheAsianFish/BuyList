import os
import json
from litellm import completion

class LLMBot:
    def __init__(self, model="gemini/gemini-pro", api_key=None):
        """
        Initialize the bot with a model name and optional API key.
        Examples of models: 'gpt-3.5-turbo', 'claude-3-opus', 'gemini/gemini-pro'.
        """
        self.model = model
        # Use passed key, or environment variable, or fallback to placeholder
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY") or "API_HERE"

    def generate_json(self, user_text):
        """
        Generates structured JSON (Ingredients + Instructions) from user text, 
        saves it to a file, and returns it.
        """
        # Mock response if key is missing
        if self.api_key == "API_HERE" or not self.api_key:
            print("Warning: No API Key provided. Returning mock data.")
            return self._save_and_return(self._mock_data())

        system_prompt = """
        You are a helpful cooking assistant.
        Your goal is to extract a recipe and shopping list from the user's request.
        Return ONLY valid JSON.
        Follow this strict schema:
        {
            "dish": "Name of the dish",
            "servings": 4,
            "ingredients": [
                {
                    "name": "ingredient name", 
                    "quantity": "amount", 
                    "unit": "unit", 
                    "notes": "notes"
                }
            ],
            "instructions": [
                "Step 1: ...",
                "Step 2: ...",
                "..."
            ]
        }
        Ensure the instructions utilize the ingredients listed.
        """

        try:
            response = completion(
                model=self.model,
                api_key=self.api_key,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_text}
                ]
            )
            
            content = response.choices[0].message.content
            parsed_data = self._parse_json(content)
            return self._save_and_return(parsed_data)

        except Exception as e:
            print(f"LLM Error: {e}")
            return self._save_and_return({
                "dish": "Error processing request",
                "servings": 0,
                "ingredients": [],
                "instructions": ["Error: Could not generate instructions."]
            })

    def _parse_json(self, content):
        content = content.strip()
        # Clean markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        return json.loads(content)

    def _save_and_return(self, data):
        # Pipeline step: Save to file for the Parallel Search / Store Crawler
        output_path = os.path.join(os.path.dirname(__file__), "ingredients.json")
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)
        print(f"Pipeline output saved to: {output_path}")
        return data

    def _mock_data(self):
        return {
            "dish": "Mock Lasagna (Set API Key)",
            "servings": 4,
            "ingredients": [
                {"name": "Ground Beef", "quantity": "1", "unit": "lb", "notes": "Lean"},
                {"name": "Lasagna Noodles", "quantity": "1", "unit": "box", "notes": "Oven ready"},
                {"name": "Ricotta Cheese", "quantity": "15", "unit": "oz", "notes": ""},
                {"name": "Marinara Sauce", "quantity": "24", "unit": "oz", "notes": "Jar"},
                {"name": "Mozzarella Cheese", "quantity": "2", "unit": "cups", "notes": "Shredded"}
            ],
            "instructions": [
                "1. Brown the ground beef in a skillet.",
                "2. Cook lasagna noodles according to package instructions.",
                "3. Layer noodles, cheese, beef, and sauce in a baking dish.",
                "4. Bake at 375°F for 45 minutes.",
                "5. Let cool before serving."
            ]
        }

if __name__ == "__main__":
    # Example usage
    bot = LLMBot(model="gemini/gemini-pro") 
    print(bot.generate_json("I want to make a big pot of chili."))
