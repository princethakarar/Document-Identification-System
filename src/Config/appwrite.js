import { Client, Databases, Query, Storage } from "appwrite";

const clientHack = new Client();

clientHack
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('677301de002106afb13b');

const storageHack = new Storage(clientHack);
const databasesHack = new Databases(clientHack);

export { clientHack, databasesHack, Query, storageHack };