import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';


@Component({
    selector: 'edit-company',
    templateUrl: './edit-company.component.html',
    styleUrls: ['./edit-company.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditCompanyComponent implements OnInit, OnDestroy {
   
    updatecompanyForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    companyName: string;
    companyAddress: string;
    owner: string;
    companyFax: string;
    mobile: string;
    companyEmail: string;    
    submitRes: any;
    
    companyData: any;
    

    // Private
    private _unsubscribeAll: Subject<any>;
/**
     * Constructor
     *
     
     * @param {FuseSidebarService} _fuseSidebarService
     
     */
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private alertService: AlertService) {
        // Configure the layout
        this.showLoaderImg = false;
        this.companyData = JSON.parse(localStorage.getItem('companyData'));
        console.log(this.companyData);
        
        console.log(this.companyData.companyName);

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
        
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
      
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.companyData = JSON.parse(localStorage.getItem('companyData'));
        this.updatecompanyForm = this._formBuilder.group({
            companyName : [this.companyData.companyName, Validators.required],
            companyAddress: [this.companyData.companyAddress, Validators.required],
            owner: [this.companyData.owner, Validators.required],
            companyFax: [this.companyData.companyFax, Validators.required],
            mobile: [this.companyData.mobile, Validators.required],
            companyEmail: [this.companyData.companyEmail, Validators.pattern("^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$")],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/master/company-management';        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    get f() { return this.updatecompanyForm.controls; }
    register() { }

    
    onSubmit() {
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.updatecompanyForm.invalid) {
            return;
        }else {
            const reqData = {
                "id":this.companyData.id,
                "companyName": this.f.companyName.value,
                "companyEmail": this.f.companyEmail.value,
                "mobile": this.f.mobile.value,
                "companyAddress":  this.f.companyAddress.value,
                "companyFax": this.f.companyFax.value,
                "owner": this.f.owner.value,
                "createdBy": localStorage.getItem('userId'),
                "updatedBy": localStorage.getItem('userId')
            }
            console.log(reqData);
            this.loading = true;
            this._userService.updateCompanyList(reqData)
            .pipe(first())
            .subscribe(
            data => {
                this.showLoaderImg = false;
                this.submitRes = data;
                if (this.submitRes.success === true) {
                    this.alertService.success(this.submitRes.message, 'Success');
                    this.router.navigate([this.returnUrl]);
                    this.updatecompanyForm.reset();
                } else {
                    this.alertService.error(this.submitRes.message, 'Error');
                }
                console.log(data);
            },
            error => {
                console.log(error.message);
                this.alertService.error(error.message, 'Error');
                this.loading = false;
            });
        }


    }
    
}