export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  personality: string;
  scenario: string;
  example_dialogs: string;
  first_message: string;

  // Unrelated for Discord
  // created_at: string;
  // creator_id: string;
  // creator_name: string;
  // creator_verified: boolean;
  // is_nsfw: boolean;
  // is_public: boolean;
  // showdefinition: boolean;
  // total_chat: string;
  // total_message: string;
  // updated_at: string;
  // is_deleted: boolean;
  // tags: Tag[];
  // stats: Stats;
}

// interface Tag {
//   id: number;
//   created_at: string;
//   name: string;
//   slug: string;
//   description: string;
// }

// interface Stats {
//   chat: string;
//   message: string;
// }

export type OptionsCharacterDetails = {
  params: { id: string };
};

export type ResponseCharacterDetails = Character;
