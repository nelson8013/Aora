import { Client, Account, Avatars, Databases, ID, Query } from 'react-native-appwrite';


const client = new Client()

const config = {
 endpoint: 'https://cloud.appwrite.io/v1',
 projectId: '66262db1e8732b9dbbd3',
 platform: 'com.xiela.aora',
 databaseId: '66263123dde4aad2b7eb',
 userCollectionId: '66e588b80034a53662aa',
 videoCollectionId: '66e589640035d9e027d6',
 storageId: '662633178038161fd153'
}


client.setEndpoint(config.endpoint)
 .setProject(config.projectId)
 .setPlatform(config.platform);

 //Innitialize account
 const account = new Account(client)
 const avatars = new Avatars(client)
 const databases =  new Databases(client)

//User Registration
export const createUser = async (email, password, username ) => {

 try {
   const newAccount = await account.create(ID.unique(), email, password, username);
   if(!newAccount) throw Error;
   const avatarUrl = avatars.getInitials(username);
   await Login(email, password);

   const newUser = await databases.createDocument(
                   config.databaseId,
                   config.userCollectionId,
                   ID.unique(),
                   {
                    accountId: newAccount.$id,
                    email,
                    username,
                    avatar: avatarUrl
                   }
      
   );

   return newUser;

 } catch (error) {
   console.log(error);
   throw new Error(error);
 }
}


export const Login = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password)
  } catch (error) {
   console.log(error)
   throw new Error(error)
  }
}

export const getCurrentUser = async () => {
 try {

  const currentAccount = await account.get()

  if(!currentAccount || !currentAccount.$id) {
   throw new Error('No account found');
  }
   

   const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
  )
  
  if (!currentUser || !currentUser.documents || currentUser.documents.length === 0) {
   throw new Error("No user found for this account");
   }

  return currentUser.documents[0];
 } catch (error) {
  console.log(error)
 }
}


export const checkActiveSession = async () => {
 try {
   const session = await account.getSession('current'); 

   console.log("ACTIVE SESSION:::", session)
   return session !== null; 
 } catch (error) {
  
   if (error.code === 401) {
     return false; 
   }
   throw error; 
 }
};

export const deleteSessions = async () => {
 try {
   // Get the list of all sessions
   const sessions = await account.listSessions();

   // Delete each session
   await Promise.all(
     sessions.sessions.map(async (session) => {
       await account.deleteSession(session.$id);
     })
   );

   console.log('All sessions deleted successfully');
 } catch (error) {
   console.error('Error deleting sessions:', error.message);
   throw error; // Re-throw the error for further handling
 }
};


export const getAllPosts = async () => {
  try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
      );

      return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.orderDesc('$createdAt', Query.limit(7))]
      );

      return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}