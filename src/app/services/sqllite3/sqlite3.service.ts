import { Injectable } from '@angular/core';
;
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions, capSQLiteResult, capSQLiteValues} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserUpgradeStatements } from '../../commondfiles/commondef';
import { SQLiteService } from '../sqlite/sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class sqliteDatabaseService {
  public userList: BehaviorSubject<User[]> =
  new BehaviorSubject<User[]>([]);
  private databaseName: string = "";
  private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
  private versionUpgrades;
  private loadToVersion;
  private db!: SQLiteDBConnection;
  private isUserReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqliteService: SQLiteService) {
    this.versionUpgrades = this.uUpdStmts.userUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length-1].toVersion;
  }
  async openDatabase(dbName: string) {
   /* this.sqliteService.initializePlugin();
    this.databaseName = dbName;
  //  this.databaseName = "myuserdb";
    console.log(this.databaseName);
    // create upgrade statements
    await this.sqliteService
      .addUpgradeStatement({  database: this.databaseName,
                              upgrade: this.versionUpgrades});
    // create and/or open the database
    console.log(this.databaseName,this.loadToVersion);
    this.db = await this.sqliteService.openDatabase(this.databaseName,
                                          false,
                                          'no-encryption',
                                          this.loadToVersion,
                                          false
    );
    this.sqliteService.setdbVersion(this.databaseName,this.loadToVersion);*/

    ///await this.getUsers();
  }
  userState() {
    return this.isUserReady.asObservable();
  }
  fetchUsers(): Observable<User[]> {
    return this.userList.asObservable();
  }

  async loadUsers() {
    const users: User[]= (await this.db.query('SELECT * FROM users;')).values as User[];
    console.log(users);
    this.userList.next(users);
  }
  async getUsers() {
    await this.loadUsers();
    this.isUserReady.next(true);
  }
  async addUser(name: string) {
    const sql = `INSERT INTO users (name) VALUES (?);`;
    await this.db.run(sql,[name]);
    await this.getUsers();
  }

  async updateUserById(id: string, active: number) {
    const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
    await this.db.run(sql);
    await this.getUsers();
  }
  async deleteUserById(id: string) {
    const sql = `DELETE FROM users WHERE id=${id}`;
    await this.db.run(sql);
    await this.getUsers();
  }
  async getVoucher(dbName:string,voucherNo:string): Promise<any[]>
  {
    return[];


         await this.openDatabase(dbName);

        let sStmt = "Select VoucherNo,SNo,"

        sStmt += "Case substr(VoucherNo,0,5) When 'RCV-' Then accDr.Name When 'PAV-' Then  accCr.Name Else (CASE TRType  WHEN 'Cr' THEN accDr.Name else accCr.Name  end ) End  Account1_Name ,";
       sStmt += "STRFTIME('%d/%m/%Y', VoucherDate) VoucherDate,STRFTIME('%d/%m/%Y', DueDate) DueDate,Narration,";
        sStmt += "Case substr(VoucherNo,0,5) When 'RCV-' Then accCr.Name When 'PAV-' Then  accDr.Name Else (CASE TRType  WHEN 'Cr' THEN accCr.Name else accDr.Name  end ) End Account2_Name,";
        sStmt += `Amount,TrType,LNarration,ChequeNo From FAccounting,Mast1 accDr,Mast1 accCr Where VoucherNo = '${voucherNo}' And accDr.Id = AccountDr And accCr.Id = AccountCr Order by SNo`;

        console.log("get form local ");
      const result = await this.db.query(sStmt);
      this.db.close();;
    return result.values || [];
  }
}
/*export class sqliteDatabaseService  {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
   db!:SQLiteDBConnection;
  private isStoreInitialized = false;
  constructor() { }

   async init() {
    if (Capacitor.getPlatform() === 'web' && !this.isStoreInitialized) {
      try {
        await this.initializeWebStore();
        this.isStoreInitialized = true;
        console.log("init webstore 22");
      } catch (err) {
        console.error('Error during initWebStore:', err);
        throw err;
      }
    }
  }
  async openMyDatabase(dbName:string) {
    if (!this.isStoreInitialized) {
      await this.init();
    }
    if (!this.sqlite) {
      throw new Error('SQLite connection not available.');
    }
    const db = await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);
    await db.open();
    return db;
  }
 private async initializeWebStore() {
    // Check if the jeep-sqlite element is not present, then add it.
    const jeepEl = document.querySelector('jeep-sqlite');
    if (!jeepEl) {
      const newJeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(newJeepEl);
      await customElements.whenDefined('jeep-sqlite');
    }

    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    await this.sqlite.initWebStore();
  }
  async initializePlugin(): Promise<boolean>
  {
    try
    {
      console.log("Insise initializePlugin");
      if (Capacitor.getPlatform() === 'web')
      {
          console.log("befor init webstore");

       setTimeout(async () => {await customElements.whenDefined('jeep-sqlite')},100);
       console.log("after init webstore11");
      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        setTimeout(async () => {
          await this.sqlite.initWebStore();
              // continue initialization
            }, 100);
      }
           console.log("after init webstore");
      }
      return true;
    }
    catch (e)
    {
      console.error('Error initializing sqlite capactior plugin:', e);
      return false;
    }
  }

  async openDatabase(dbName:string,readonly:boolean): Promise<boolean>
  {
    try
    {
      // Check if a connection already exists to avoid errors
      await this.initializePlugin();
      const isCon = await this.sqlite.isConnection(dbName,readonly);
      if (isCon.result)
      {
          this.db = await this.sqlite.retrieveConnection(dbName,readonly);
      }
      else
      {
        // Options for creating a new connection
        const dbOptions = {
          database: dbName,
          version: 1,
          encrypted: false,
          mode: 'no-encryption',
          readonly: false,
      };

      this.db = await this.sqlite.createConnection(dbName,false,'no-encryption',1,readonly);
      await this.db.open();
      console.log(`openened database successfully :${dbName}`);
    }
    return true;
    }
    catch (e)
    {
      console.error(`Error opening database :${dbName}`, e);
      return true;
    }
  }
   async closeDatabase(): Promise<void>
   {
    if (this.db)
      {
      try
      {
        await this.db.close();
        console.log('Database connection closed successfully.');
        this.db = null!; // Reset the db property
      }
      catch (e)
      {
        console.error('Error closing database connection:', e);
      }
    }
  }
  async getVoucher(dbName:string,voucherNo:string): Promise<any[]>
  {


        let db:SQLiteDBConnection =  await this.openMyDatabase(dbName);
         let capSQLiteResult =  db.isDBOpen();
      //  if (!db)
      //    return [];
        let sStmt = "Select VoucherNo,SNo,"

        sStmt += "Case substr(VoucherNo,0,5) When 'RCV-' Then accDr.Name When 'PAV-' Then  accCr.Name Else (CASE TRType  WHEN 'Cr' THEN accDr.Name else accCr.Name  end ) End  Account1_Name ,";
       sStmt += "STRFTIME('%d/%m/%Y', VoucherDate) VoucherDate,STRFTIME('%d/%m/%Y', DueDate) DueDate,Narration,";
        sStmt += "Case substr(VoucherNo,0,5) When 'RCV-' Then accCr.Name When 'PAV-' Then  accDr.Name Else (CASE TRType  WHEN 'Cr' THEN accCr.Name else accDr.Name  end ) End Account2_Name,";
        sStmt += `Amount,TrType,LNarration,ChequeNo From FAccounting,Mast1 accDr,Mast1 accCr Where VoucherNo = '${voucherNo}' And accDr.Id = AccountDr And accCr.Id = AccountCr Order by SNo`;

        console.log("get form local ",capSQLiteResult);
      const result = await db.query(sStmt);
      this.closeDatabase();
    return result.values || [];
  }

}
*/
