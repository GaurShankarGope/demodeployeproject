import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { config } from '../config/config';
import { Options } from 'selenium-webdriver';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    baseUrl = config.baseUrl;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


        login(username, mobile, password,countryCOdeInfo) {

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${this.baseUrl}/userslogin`, { username, mobile, password,countryCOdeInfo }, {
          headers: headers
        })
        .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('userData', JSON.stringify(user));
         // console.log('t',localStorage);
          this.currentUserSubject.next(user);
          return user;
        }));
      }
      
        // register(Email, GamerTag, Password) {
        //   //console.log(config.baseUrl);
        //   let headers = new HttpHeaders();
        //   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        //   return this.http.post<any>(`${this.baseUrl}/register`, { Email, GamerTag, Password }, {
        //     headers
        //   })
        //     .pipe(map(user => {
        //       // store user details and jwt token in local storage to keep user logged in between page refreshes
      
        //       return user;
      
        //     }));
      
        // }
      
        forgotPassword(email) {
         // console.log(email);
         // console.log(config.baseUrl);
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json; charset=utf-8');
          return this.http.post<any>(`${this.baseUrl}/userforgotpassword`, {  email }, {
              headers: headers
          })
              .pipe(map(user => {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
                  return user;
                  
              }));        
        }
        resetPasswordData(resetToken, resetpassword ) {
         // console.log(resetToken);
         // console.log(resetpassword);
         // console.log(config.baseUrl);
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json; charset=utf-8');
          return this.http.post<any>(`${this.baseUrl}/resetPassword`, { resetToken, resetpassword }, {
              headers: headers
          })
              .pipe(map(user => {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
                  return user;
                  
              }));
              
        }

        userChangePassword(resetToken, resetpassword )
        {
            let headers = new HttpHeaders();
            headers = headers.set('Content-Type', 'application/json; charset=utf-8');
            return this.http.post<any>(`${this.baseUrl}/resetPassword`, { resetToken, resetpassword }, {
                headers: headers
            })
                .pipe(map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    
                    return user;
                    
                }));
                
        }
      
        changePassword(oldpassword, newpassword, id ) {
          //console.log(oldpassword);
          //console.log(newpassword);
          //console.log(config.baseUrl);
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json; charset=utf-8');
          return this.http.post<any>(`${this.baseUrl}/userchangepassword`, { oldpassword, newpassword, id }, {
              headers: headers
          })
              .pipe(map(user => {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
                  return user;
                  
              }));
              
        }
        systemActivityAlert(userid ) {
          
          let headers = new HttpHeaders();
          headers = headers.set('Content-Type', 'application/json; charset=utf-8');
          return this.http.post<any>(`${this.baseUrl}/systemActivityAlert`, { userid }, {
              headers: headers
          })
              .pipe(map(user => {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  
                  return user;
                  
              }));
              
        }
      
        logout() {
          // remove user from local storage and set current user to null
          localStorage.removeItem('userToken');
          this.currentUserSubject.next(null);
        }
      

    // login(email, password) {
    //    // console.log(config.baseUrl);
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        
    //     return this.http.post<any>(`${this.baseUrl}/superadminlogin`, { email, password }, {
    //         headers: headers
    //     })
    //         .pipe(map(user => {
    //            // console.log(user);
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('currentUser', JSON.stringify(user));
    //             this.currentUserSubject.next(user);
    //             return user;
                
    //         }));
            
    // }

    // register(username, email, password, otp, firstname, lastname, mobileno) {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    //     return this.http.post<any>(`${this.baseUrl}/superadminregister`, { username, email, password, otp, firstname, lastname, mobileno }, {
    //         headers: headers
    //     })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
                
    //             return user;
                
    //         }));
            
    // }
    

    // forgotPassword(email) {
    //    // console.log(email);
    //    // console.log(config.baseUrl);
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    //     return this.http.post<any>(`${this.baseUrl}/forgotpassword`, {  email }, {
    //         headers: headers
    //     })
    //         .pipe(map(user => {
                
    //             return user;
                
    //         }));
            
    // }

    // // changePassword(oldpassword, newpassword, id) {
    // //     return this.http.post(`${config.baseUrl}/changepassword`, oldpassword, newpassword, id);
    // // }

    // changePassword(oldpassword, newpassword, id ) {
        
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    //     return this.http.post<any>(`${this.baseUrl}/changepassword`, { oldpassword, newpassword, id }, {
    //         headers: headers
    //     })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
                
    //             return user;
                
    //         }));
            
    //   }

    // // changepassword(email) {
    // //    // console.log(email);
    // //    // console.log(config.baseUrl);
    // //     let headers = new HttpHeaders();
    // //     headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // //     return this.http.post<any>(`${this.baseUrl}/changepassword`, {  email }, {
    // //         headers: headers
    // //     })
    // //         .pipe(map(user => {
                
    // //             return user;
                
    // //         }));
            
    // // }


    // logout() {
    //     localStorage.clear();
    //     this.currentUserSubject.next(null);
    // }
    
}