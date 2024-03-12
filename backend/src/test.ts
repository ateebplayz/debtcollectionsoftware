import { collections } from "./modules/mongo";

collections.backup.drop()
collections.clients.drop()
collections.companies.drop()
collections.contracts.drop()
collections.foreverContracts.drop()