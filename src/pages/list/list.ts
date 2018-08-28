import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { AddDataPage } from '../add-data/add-data';
import { EditDataPage } from '../edit-data/edit-data';

@Component({
  selector: 'page-home',
  templateUrl: 'list.html'
})
export class ListPage {

  students: any = [];
  
  

  constructor(public navCtrl: NavController,
    private sqlite: SQLite) {}

    ionViewDidLoad() {
      this.getData();
    }
    
    ionViewWillEnter() {
      this.getData();
    }

    getData() {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS student(rowid INTEGER PRIMARY KEY, name TEXT, lastName TEXT, gender TEXT, studentNum INT, age INT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM student ORDER BY rowid DESC', [])
        .then(res => {
          this.students = [];
          for(var i=0; i<res.rows.length; i++) {
            this.students.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,lastName:res.rows.item(i).lastName,gender:res.rows.item(i).gender,studentNum:res.rows.item(i).studentNum,age:res.rows.item(i).age});
          }
        })
      }).catch(e => console.log(e));
    }
    
    addData() {
      this.navCtrl.push(AddDataPage);
    }
    
    editData(rowid) {
      this.navCtrl.push(EditDataPage, {
        rowid:rowid
      });
    }
    
    deleteData(rowid) {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM student WHERE rowid=?', [rowid])
        .then(res => {
          console.log(res);
          this.getData();
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
}
