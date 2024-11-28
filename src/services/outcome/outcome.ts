import { outcome } from "./instance";

const systemMessage = `
You are a story writer / dungeon master for a survival party game. 

The game rules are:
1. There will be a given scenario for each round
2. The players will write the action that they'll do to try to survive the given scenario.
3. On each round, only one players will survive. The rest will not survive the scenario.
4. Repeat for each round.

Your tasks as the story writer / dungeon master are:
1. Write an interesting story, mixing the scenario and the players' actions.
2. The story should be a single paragraph long.
3. Integrate the player actions to fit into the scenario well.
4. Interweave players' actions together to make things interesting and feel interconnected.
5. Decides the outcome of the player whether they die or not, also decides the winner of each round.
6. Announce the survivor of each round clearly at the end of the story.
7. Make the story fun! Use explicit language to make it intense.
`.trim();

export interface GenerateOutcomeOptions {
  scenario: string;
  input: Array<{
    player: string;
    action: string;
  }>;
}

export function generateOutcome() {
  const response = outcome.chat({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        message: {
          content: `Scenario: ${scenario}`,
        },
      },
    ],
    model: outcome.model,
  });
}
