# Milo

Milo is a versatile AI assistant designed to help you with various tasks, from coding to content creation. It integrates with multiple AI models and provides a user-friendly interface for interaction.

## Features

- **Multi-Model Support**: Integrates with all available AI models supported by Groq, including the latest models.
- **Skill Management**: Easily add and manage skills to extend Milo's capabilities.
- **Customizable**: Modify Milo's behavior and skills to suit your needs.
- **Docker Support**: Run Milo in a Docker container for easy deployment.

## Getting Started

### Docker Setup

To run Milo using Docker, follow these steps:

1. Ensure you have Docker installed on your machine.
2. Copy the `compose.yml` file to your project directory.
3. Update the `GROQ_API_KEY` environment variable in the `compose.yml` file with your Groq API key.
4. Run the following command to start the services:

   ```bash
   docker-compose -f compose.yml up -d
   ```

5. Access Milo:

    ```bash
    docker exec -it milo sh
    /app # npm run milo
    ```

## Skills

Milo supports various skills that can be added to enhance its functionality. Skills are located in the `skills` directory. You can create new skills or modify existing ones to tailor Milo to your needs.

### Adding a Custom Skill

To add a new skill, follow these steps:

1. Create a new TypeScript file in the `skills` docker volume.
2. Implement the skill logic like this:

   ```typescript
   const mySkill = async (args: string) => {
      // Your skill logic here
      return `Processed args: ${args}`;
   };

   module.exports.params = {
      name: "MySkill",
      description: "A custom skill to process args",
      tags: ["custom", "skill"],
   }

   export default mySkill;
   ```

Note that the skill must export a default function and a `params` object with `name`, `description`, and `tags`.  
The `params` object is used to select the right skill when multiple skills are available.  
The `arguments` passed to the skill is an optional string that can be used to pass additional data to the skill.

### Using a Custom Skill

After adding a skill, you can just restart Milo's Docker container to load the new skill.  
Milo will automatically detect and register the new skill.

## TODO

- [ ] Add more built-in skills.
- [ ] Implement a small REST API to interact with Milo.
- [x] Change LLM response by streaming the response to the client.

## Contributing

We welcome contributions to Milo! If you have ideas for new features, improvements, or bug fixes, please open an issue or submit a pull request.

## License

Milo is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
