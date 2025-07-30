const joke = async () => {
  try {
    const response = await fetch(
      `https://official-joke-api.appspot.com/jokes/random`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return "An error occurred while fetching the joke.";
  }
};

module.exports.params = {
  name: "joke",
  description: "Get a joke.",
  tags: ["joke", "funny", "humor"],
};

export default joke;
