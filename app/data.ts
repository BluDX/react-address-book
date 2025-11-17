// ============================================================================
// DATA.TS - Fake database for storing and managing contacts
// ============================================================================
// 🛑 Nothing in here has anything to do with React Router, it's just a fake database
// In a real app, you'd replace this with actual database calls or API requests

// Import helper libraries
import { matchSorter } from "match-sorter"; // Helps search/filter arrays
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by"; // Helps sort arrays by properties
import invariant from "tiny-invariant"; // Throws errors if conditions aren't met

// ============================================================================
// TYPE DEFINITIONS: Describes the shape of our data
// ============================================================================

// ContactMutation: Properties that can be changed on a contact
// The ? means these properties are optional (they might not exist)
type ContactMutation = {
  id?: string;       // Unique identifier (optional when creating)
  first?: string;    // First name
  last?: string;     // Last name
  avatar?: string;   // URL to profile picture
  twitter?: string;  // Twitter handle
  notes?: string;    // Additional notes about the contact
  favorite?: boolean; // Whether this contact is marked as favorite
};

// ContactRecord: A complete contact with required fields
// This extends ContactMutation and adds mandatory properties
export type ContactRecord = ContactMutation & {
  id: string;        // ID is required for saved contacts
  createdAt: string; // Timestamp when contact was created
};

// ============================================================================
// FAKE DATABASE: An object that acts like a database table
// ============================================================================
// This is just a JavaScript object stored in memory
// When you refresh the page, all data is lost (in a real app, data persists)
const fakeContacts = {
  // records: An object that stores contacts by their ID
  // Example: { "john-doe": {id: "john-doe", first: "John", ...}, ... }
  records: {} as Record<string, ContactRecord>,

  // GET ALL CONTACTS: Returns an array of all contacts
  async getAll(): Promise<ContactRecord[]> {
    // Object.keys gets all the IDs from our records object
    return Object.keys(fakeContacts.records)
      // Map each ID to its corresponding contact record
      .map((key) => fakeContacts.records[key])
      // Sort by createdAt (newest first) then by last name
      .sort(sortBy("-createdAt", "last"));
      // The "-" before createdAt means descending order
  },

  // GET ONE CONTACT: Returns a single contact by ID
  async get(id: string): Promise<ContactRecord | null> {
    // Look up the contact by ID, return null if not found
    return fakeContacts.records[id] || null;
  },

  // CREATE A CONTACT: Adds a new contact to our database
  async create(values: ContactMutation): Promise<ContactRecord> {
    // Generate a random ID if one wasn't provided
    // Math.random() creates a decimal, .toString(36) converts to base-36
    // .substring(2, 9) takes characters 2-9 for a short random string
    const id = values.id || Math.random().toString(36).substring(2, 9);
    
    // Get the current timestamp in ISO format
    const createdAt = new Date().toISOString();
    
    // Create the new contact object by combining values with id and createdAt
    const newContact = { id, createdAt, ...values };
    // ...values spreads all the properties from the values object
    
    // Store the new contact in our records object
    fakeContacts.records[id] = newContact;
    
    // Return the newly created contact
    return newContact;
  },

  // UPDATE A CONTACT: Modifies an existing contact
  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    // First, get the existing contact
    const contact = await fakeContacts.get(id);
    
    // Make sure the contact exists - throw an error if it doesn't
    invariant(contact, `No contact found for ${id}`);
    
    // Create an updated contact by merging existing data with new values
    const updatedContact = { ...contact, ...values };
    // Properties in values will overwrite properties in contact
    
    // Save the updated contact back to our records
    fakeContacts.records[id] = updatedContact;
    
    // Return the updated contact
    return updatedContact;
  },

  // DELETE A CONTACT: Removes a contact from the database
  destroy(id: string): null {
    // Delete the contact from our records object
    delete fakeContacts.records[id];
    // Return null to indicate success
    return null;
  },
};

// ============================================================================
// HELPER FUNCTIONS: Easy-to-use functions for route components
// ============================================================================
// These are the functions that your route components will actually call

// GET CONTACTS WITH OPTIONAL SEARCH: Returns all contacts, optionally filtered
export async function getContacts(query?: string | null) {
  // Simulate a delay like a real database would have (500 milliseconds)
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Get all contacts from our fake database
  let contacts = await fakeContacts.getAll();
  
  // If a search query was provided, filter the contacts
  if (query) {
    // matchSorter searches through contacts and returns matches
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"], // Search in first and last name fields
    });
  }
  
  // Sort results by last name, then by creation date
  return contacts.sort(sortBy("last", "createdAt"));
}

// CREATE EMPTY CONTACT: Creates a new contact with no information
export async function createEmptyContact() {
  // Create a contact with an empty object (all fields will be undefined)
  const contact = await fakeContacts.create({});
  return contact;
}

// GET CONTACT BY ID: Returns a specific contact
export async function getContact(id: string) {
  // Simply call the get method from our fake database
  return fakeContacts.get(id);
}

// UPDATE CONTACT: Changes information for a specific contact
export async function updateContact(id: string, updates: ContactMutation) {
  // First, get the existing contact to make sure it exists
  const contact = await fakeContacts.get(id);
  
  // If contact doesn't exist, throw an error
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  
  // Update the contact by merging existing data with updates
  await fakeContacts.set(id, { ...contact, ...updates });
  
  // Return the contact (note: this returns the OLD contact, not the updated one)
  // This is likely a bug in the original code
  return contact;
}

// DELETE CONTACT: Removes a contact completely
export async function deleteContact(id: string) {
  // Call the destroy method to delete the contact
  fakeContacts.destroy(id);
}

// ============================================================================
// INITIAL DATA: Pre-populate the database with some contacts
// ============================================================================
// This array contains starter data - famous people from the React Router team
[
  {
    avatar:
      "https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg",
    first: "Shruti",
    last: "Kapoor",
    twitter: "@shrutikapoor08",
  },
  {
    avatar:
      "https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg",
    first: "Glenn",
    last: "Reyes",
    twitter: "@glnnrys",
  },
  {
    avatar:
      "https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg",
    first: "Ryan",
    last: "Florence",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Oscar",
    last: "Newman",
    twitter: "@__oscarnewman",
  },
  {
    avatar:
      "https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg",
    first: "Michael",
    last: "Jackson",
  },
  {
    avatar:
      "https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg",
    first: "Christopher",
    last: "Chedeau",
    twitter: "@Vjeux",
  },
  {
    avatar:
      "https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg",
    first: "Cameron",
    last: "Matheson",
    twitter: "@cmatheson",
  },
  {
    avatar:
      "https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg",
    first: "Brooks",
    last: "Lybrand",
    twitter: "@BrooksLybrand",
  },
  {
    avatar:
      "https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg",
    first: "Alex",
    last: "Anderson",
    twitter: "@ralex1993",
  },
  {
    avatar:
      "https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg",
    first: "Kent C.",
    last: "Dodds",
    twitter: "@kentcdodds",
  },
  {
    avatar:
      "https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg",
    first: "Nevi",
    last: "Shah",
    twitter: "@nevikashah",
  },
  {
    avatar:
      "https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png",
    first: "Andrew",
    last: "Petersen",
  },
  {
    avatar:
      "https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg",
    first: "Scott",
    last: "Smerchek",
    twitter: "@smerchek",
  },
  {
    avatar:
      "https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg",
    first: "Giovanni",
    last: "Benussi",
    twitter: "@giovannibenussi",
  },
  {
    avatar:
      "https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg",
    first: "Igor",
    last: "Minar",
    twitter: "@IgorMinar",
  },
  {
    avatar:
      "https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg",
    first: "Brandon",
    last: "Kish",
  },
  {
    avatar:
      "https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png",
    first: "Arisa",
    last: "Fukuzaki",
    twitter: "@arisa_dev",
  },
  {
    avatar:
      "https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg",
    first: "Alexandra",
    last: "Spalato",
    twitter: "@alexadark",
  },
  {
    avatar:
      "https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg",
    first: "Cat",
    last: "Johnson",
  },
  {
    avatar:
      "https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg",
    first: "Ashley",
    last: "Narcisse",
    twitter: "@_darkfadr",
  },
  {
    avatar:
      "https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG",
    first: "Edmund",
    last: "Hung",
    twitter: "@_edmundhung",
  },
  {
    avatar:
      "https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg",
    first: "Clifford",
    last: "Fajardo",
    twitter: "@cliffordfajard0",
  },
  {
    avatar:
      "https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg",
    first: "Erick",
    last: "Tamayo",
    twitter: "@ericktamayo",
  },
  {
    avatar:
      "https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg",
    first: "Paul",
    last: "Bratslavsky",
    twitter: "@codingthirty",
  },
  {
    avatar:
      "https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg",
    first: "Pedro",
    last: "Cattori",
    twitter: "@pcattori",
  },
  {
    avatar:
      "https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg",
    first: "Andre",
    last: "Landgraf",
    twitter: "@AndreLandgraf94",
  },
  {
    avatar:
      "https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg",
    first: "Monica",
    last: "Powell",
    twitter: "@indigitalcolor",
  },
  {
    avatar:
      "https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg",
    first: "Brian",
    last: "Lee",
    twitter: "@brian_dlee",
  },
  {
    avatar:
      "https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg",
    first: "Sean",
    last: "McQuaid",
    twitter: "@SeanMcQuaidCode",
  },
  {
    avatar:
      "https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg",
    first: "Shane",
    last: "Walker",
    twitter: "@swalker326",
  },
  {
    avatar:
      "https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg",
    first: "Jon",
    last: "Jensen",
    twitter: "@jenseng",
  },
].forEach((contact) => {
  // For each contact in the array, create it in our fake database
  fakeContacts.create({
    ...contact, // Spread all the contact properties
    // Generate a consistent ID from the person's name
    // Example: "Ryan Florence" becomes "ryan-florence"
    id: `${contact.first
      .toLowerCase()           // Make lowercase: "ryan"
      .split(" ")              // Split on spaces: ["ryan"]
      .join("_")}-${contact.last.toLocaleLowerCase()}`, // Join with underscore and add last name
  });
});

// ============================================================================
// HOW DATA.TS CONNECTS TO OTHER FILES:
// ============================================================================
// 1. Route components (like sidebar.tsx, contact.tsx) import functions from here
// 2. They call functions like getContacts(), updateContact(), etc.
// 3. These functions interact with the fakeContacts object (our "database")
// 4. The data is returned to the route components
// 5. The route components display the data to the user
