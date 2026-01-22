import { JsonDB, Config } from 'node-json-db';

export class DatabaseHelper {
  private static _instance: DatabaseHelper;

  public static get instance() {
    if (!this._instance) {
      this._instance = new DatabaseHelper();
    }
    return this._instance;
  }

  public db: JsonDB;
  private constructor() {
    this.db = new JsonDB(new Config('database', true, false, '/')); // Create a new database instance
  }
}