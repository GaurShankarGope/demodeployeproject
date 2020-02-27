import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';

@Component({
    selector: 'vessel-detail',
    templateUrl: './vessel-detail.component.html',
    styleUrls: ['./vessel-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VesselDetailComponent implements OnInit, OnDestroy {
    cols: any[];

    showModalStatus = false;
    showLoaderImg = false;
    showUpdateModalStatus = false;
    editvesselForm: FormGroup;
    loading = false;
    stateListData: any;
    statusListData: any;
    statusListRes: any;
    stateListRes: any;
    createVesselRes: any;
    imo: Number;
    vessel_name: any;
    id_operator: string;
    id_builder: string;
    id_comment: string;
    yard_number: number;
    pandl_club: string;
    fuel_consumption_total: string;
    fuel_type_1: string;
    fuel_type_2: string;
    class_narrative: string;
    group_beneficial_owner: string;
    new_construction_entry_date: string;
    contract_date: string;
    cancel_date: string;
    country_of_build: string;
    number_of_holds: string;
    number_of_hatches: string;
    fuel_consumption_main_engine_only: string;
    hull_type: string;
    main_engine_builder: string;
    main_engine_model: string;
    status: string;
    cost: string;
    scrap_value: string;
    amorization_period: string;
    cost_of_capital: string;
    annual_operating_cost: string;
    breakeven_daily_cost: string;
    daily_operating_cost: string;
    port_of_registry: string;
    owner: string;
    ship_manager: string;
    call_sign: string;
    built_month: string;
    built_year: string;
    age_of_ship: string;
    ice_class: string;
    inmarsat_phone: string;
    inmarsat_fax: string;
    inmarsat_telex: string;
    mobile: string;
    email: string;
    smc_company: string;
    smc_issued: string;
    smc_issued_date: string;
    main_engine_rpm: string;
    main_engine_stroke_type: string;
    consumption_speed: string;
    cargo_capacities_narrative: string;
    grabs: string;
    grabs_number: string;
    grabs_capacity: String;
    hull: string;
    delivery: string;
    death: string;
    dwt_tropical: string;
    dwt_tropical_freshwater: string;
    dwt_freshwater: string;
    dwt_summer: string;
    draft_tropical: Number;
    draft_tropical_freshwater: string;
    draft_freshwater: string;
    draft_summer: string;
    grt: string;
    nrt: string;
    vessel_type: string;
    bale_meter_capacity: string;
    grain_meter_capacity: string;
    bale_feet_capacity: string;
    grain_feet_capacity: string;
    holds: string;
    hatches: string;
    gear: string;
    swl: string;
    loa: string;
    lbp: string;
    beam: string;
    depth: string;
    tpc: string;
    breadth_moulded: string;
    displacement: string;
    light_weight_tons: string;
    block_coeficient: string;
    class_society: string;
    main_engine_design: string;
    main_engine_type: string;
    aux_engine_design: string;
    aux_engine_type: string;
    power: string;
    constants: string;
    flag: string;
    base: string;
    smc_expiry_date: string;
    crew: string;
    crew_nationality: string;
    hull_material: string;
    decks_number: string;
    bulbows_bow: string;
    dbl_bottom: string;
    bollard_pull: string;
    dbl_deck: string;
    winches: string;
    dbl_side_skins: string;
    survey_month: string;
    survey_year: string;
    activity: string;
    officiers_nationality: string;
    speed_laden_1: string;
    laden_fuel_1: string;
    id_fuel_type_laden_1: string;
    speed_ballast_1: string;
    ballast_fuel_1: string;
    id_fuel_type_ballast_1: string;
    speed_laden_2: string;
    laden_fuel_2: string;
    id_fuel_type_laden_2: string;
    speed_ballast_2: string;
    ballast_fuel_2: string;
    id_fuel_type_ballast_2: string;
    speed_laden_3: string;
    laden_fuel_3: string;
    id_fuel_type_laden_3: string;
    speed_ballast_3: string;
    ballast_fuel_3: string;
    id_fuel_type_ballast_3: string;
    engine_hours: string;
    fuel_aux_1: string;
    id_fuel_type_aux_1: string;
    fuel_aux_2: string;
    id_fuel_type_aux_2: string;
    fuel_aux_3: string;
    id_fuel_type_aux_3: string;
    consumption_value_1: string;
    consumption_value_2: string;
    company_background_sheet: any;
    vessal_history_sheet: any;
    operating_record_sheet: any;
    submitted = false;
    createUserRes: any;
    userRoleId: any;
    returnUrl: string;
    userData: any;
    roleAccessListData: any;

    vesseldetailListRes: any;
    vesseldetailListData: any;

    PositionListData: any;
    PositionListRes: any;

    // Private
    firstModalStatus = false;
    secondModalStatus = false;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    ) {
        this._unsubscribeAll = new Subject();
        this.stateListData = [];
        this.showLoaderImg = false;

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.stateList();
        this.statusList();
        this.vesseldetail();
        this.PositionList();
        this.cols = [
            { field: 'Position', header: 'Position' },
            { field: 'id_zone', header: 'Zone1' },
            { field: '', header: 'Lay-Can' },
            { field: 'open_date_from', header: 'Date Entered' },
            { field: '', header: 'Channel' },
            { field: '', header: 'Operator' },
            { field: '', header: 'Head Owner' },
            { field: 'main_port', header: 'Port' },

        ];

        this.editvesselForm = this._formBuilder.group({
            imo: ['', Validators.required],
            vessel_name: ['', Validators.required],
            id_operator: ['', Validators.required],
            id_builder: [''],
            id_comment: [''],
            yard_number: [''],
            pandl_club: [''],
            fuel_consumption_total: [''],
            fuel_type_1: [''],
            fuel_type_2: [''],
            class_narrative: [''],
            group_beneficial_owner: [''],
            new_construction_entry_date: [''],
            contract_date: [''],
            cancel_date: [''],
            country_of_build: [''],
            number_of_holds: [''],
            number_of_hatches: [''],
            fuel_consumption_main_engine_only: [''],
            hull_type: [''],
            main_engine_builder: [''],
            main_engine_model: [''],
            status: [''],
            cost: [''],
            scrap_value: [''],
            amorization_period: [''],
            cost_of_capital: [''],
            annual_operating_cost: [''],
            breakeven_daily_cost: [''],
            daily_operating_cost: [''],
            port_of_registry: [''],
            owner: [''],
            ship_manager: [''],
            call_sign: [''],
            built_month: [''],
            built_year: [''],
            age_of_ship: [''],
            ice_class: [''],
            inmarsat_phone: [''],
            inmarsat_fax: [''],
            inmarsat_telex: [''],
            mobile: [''],
            email: [''],
            smc_company: [''],
            smc_issued: [''],
            smc_issued_date: [''],
            main_engine_rpm: [''],
            main_engine_stroke_type: [''],
            consumption_speed: [''],
            cargo_capacities_narrative: [''],
            grabs: [''],
            grabs_number: [''],
            grabs_capacity: [''],
            hull: [''],
            delivery: [''],
            death: [''],
            dwt_tropical: [''],
            dwt_tropical_freshwater: [''],
            dwt_freshwater: [''],
            dwt_summer: [''],
            draft_tropical: [''],
            draft_tropical_freshwater: [''],
            draft_freshwater: [''],
            draft_summer: [''],
            grt: [''],
            nrt: [''],
            vessel_type: [''],
            bale_meter_capacity: [''],
            grain_meter_capacity: [''],
            bale_feet_capacity: [''],
            grain_feet_capacity: [''],
            holds: [''],
            hatches: [''],
            gear: [''],
            swl: [''],
            loa: [''],
            lbp: [''],
            beam: [''],
            depth: [''],
            tpc: [''],
            breadth_moulded: [''],
            displacement: [''],
            light_weight_tons: [''],
            block_coeficient: [''],
            class_society: [''],
            main_engine_design: [''],
            main_engine_type: [''],
            aux_engine_design: [''],
            aux_engine_type: [''],
            power: [''],
            constants: [''],
            flag: [''],
            base: [''],
            smc_expiry_date: [''],
            crew: [''],
            crew_nationality: [''],
            hull_material: [''],
            decks_number: [''],
            bulbows_bow: [''],
            dbl_bottom: [''],
            bollard_pull: [''],
            dbl_deck: [''],
            winches: [''],
            dbl_side_skins: [''],
            survey_month: [''],
            survey_year: [''],
            activity: [''],
            officiers_nationality: [''],
            speed_laden_1: [''],
            laden_fuel_1: [''],
            id_fuel_type_laden_1: [''],
            speed_ballast_1: [''],
            ballast_fuel_1: [''],
            id_fuel_type_ballast_1: [''],
            speed_laden_2: [''],
            laden_fuel_2: [''],
            id_fuel_type_laden_2: [''],
            speed_ballast_2: [''],
            ballast_fuel_2: [''],
            id_fuel_type_ballast_2: [''],
            speed_laden_3: [''],
            laden_fuel_3: [''],
            id_fuel_type_laden_3: [''],
            speed_ballast_3: [''],
            ballast_fuel_3: [''],
            id_fuel_type_ballast_3: [''],
            engine_hours: [''],
            fuel_aux_1: [''],
            id_fuel_type_aux_1: [''],
            fuel_aux_2: [''],
            id_fuel_type_aux_2: [''],
            fuel_aux_3: [''],
            id_fuel_type_aux_3: [''],
            consumption_value_1: [''],
            consumption_value_2: [''],
           
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/vessel-management';
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }
    get f() { return this.editvesselForm.controls; }

    onFileSelect(value) {
        if (value.target.files.length > 0) {
            const file = value.target.files[0];
            this.company_background_sheet =  file;
        }
        console.log(this.company_background_sheet);
        
    }
    onFileSelect2(value) {
        if (value.target.files.length > 0) {
            const file = value.target.files[0];
            this.vessal_history_sheet =  file;
        }
        console.log(this.vessal_history_sheet);
    }
    onFileSelect3(value) {
        if (value.target.files.length > 0) {
            const file = value.target.files[0];
            this.operating_record_sheet =  file;
        }
        console.log(this.operating_record_sheet);
    }
    onSubmit(): void {
        console.log('add user');
        this.submitted = true;
        this.showLoaderImg = true;

        // reset alerts on submit
        this.alertService.clear();
    
        // stop here if form is invalid
        console.log(this.editvesselForm);
        if (this.editvesselForm.invalid) {
            console.log('add user invalid');
            return;
        } else {
            console.log('add');
            const formData = new FormData();
            formData.append('imo', this.f.imo.value);
            formData.append('vessel_name', this.f.vessel_name.value);
            formData.append('id_operator', this.f.id_operator.value);
            formData.append('id_builder', this.f.id_builder.value);
            formData.append('id_comment', this.f.id_comment.value);
            formData.append('yard_number', this.f.yard_number.value);
            formData.append('pandl_club', this.f.pandl_club.value);
            formData.append('fuel_consumption_total', this.f.fuel_consumption_total.value);
            formData.append('fuel_type_1', this.f.fuel_type_1.value);
            formData.append('fuel_type_2', this.f.fuel_type_2.value);
            formData.append('class_narrative', this.f.class_narrative.value);
            formData.append('group_beneficial_owner', this.f.group_beneficial_owner.value);
            formData.append('new_construction_entry_date', this.f.new_construction_entry_date.value);
            formData.append('contract_date', this.f.contract_date.value);
            formData.append('cancel_date', this.f.cancel_date.value);
            formData.append('country_of_build', this.f.country_of_build.value);
            formData.append('number_of_holds', this.f.number_of_holds.value);
            formData.append('number_of_hatches', this.f.number_of_hatches.value);
            formData.append('fuel_consumption_main_engine_only',this.f.fuel_consumption_main_engine_only.value);
            formData.append('hull_type', this.f.hull_type.value);
            formData.append('main_engine_builder', this.f.main_engine_builder.value);
            formData.append('main_engine_model', this.f.main_engine_model.value);
            formData.append('status', this.f.status.value);
            formData.append('cost', this.f.cost.value);
            formData.append('scrap_value', this.f.scrap_value.value);
            formData.append('amorization_period', this.f.amorization_period.value);
            formData.append('cost_of_capital', this.f.cost_of_capital.value);
            formData.append('annual_operating_cost', this.f.annual_operating_cost.value);
            formData.append('breakeven_daily_cost', this.f.breakeven_daily_cost.value);
            formData.append('daily_operating_cost', this.f.daily_operating_cost.value);
            formData.append('port_of_registry', this.f.port_of_registry.value);
            formData.append('owner', this.f.owner.value);
            formData.append('ship_manager', this.f.ship_manager.value);
            formData.append('call_sign', this.f.call_sign.value);
            formData.append('built_month', this.f.built_month.value);
            formData.append('built_year', this.f.built_year.value);
            formData.append('age_of_ship', this.f.age_of_ship.value);
            formData.append('ice_class', this.f.ice_class.value);
            formData.append('inmarsat_phone', this.f.inmarsat_phone.value);
            formData.append('inmarsat_fax', this.f.inmarsat_fax.value);
            formData.append('inmarsat_telex', this.f.inmarsat_telex.value);
            formData.append('mobile', this.f.mobile.value);
            formData.append('email', this.f.email.value);
            formData.append('smc_company', this.f.smc_company.value);
            formData.append('smc_issued', this.f.smc_issued.value);
            formData.append('smc_issued_date', this.f.smc_issued_date.value);
            formData.append('main_engine_rpm', this.f.main_engine_rpm.value);
            formData.append('main_engine_stroke_type', this.f.main_engine_stroke_type.value);
            formData.append('consumption_speed', this.f.consumption_speed.value);
            formData.append('cargo_capacities_narrative', this.f.cargo_capacities_narrative.value);
            formData.append('grabs', this.f.grabs.value);
            formData.append('grabs_number', this.f.grabs_number.value);
            formData.append('grabs_capacity', this.f.grabs_capacity.value);
            formData.append('hull', this.f.hull.value);
            formData.append('delivery', this.f.delivery.value);
            formData.append('death', this.f.death.value);
            formData.append('dwt_tropical', this.f.dwt_tropical.value);
            formData.append('dwt_tropical_freshwater', this.f.dwt_tropical_freshwater.value);
            formData.append('dwt_freshwater', this.f.dwt_freshwater.value);
            formData.append('draft_tropical', this.f.draft_tropical.value);
            formData.append('dwt_summer', this.f.dwt_summer.value);
            formData.append('draft_tropical_freshwater', this.f.draft_tropical_freshwater.value);
            formData.append('draft_freshwater', this.f.draft_freshwater.value);
            formData.append('draft_summer', this.f.draft_summer.value);
            formData.append('grt', this.f.grt.value);
            formData.append('nrt', this.f.nrt.value);
            formData.append('vessel_type', this.f.vessel_type.value);
            formData.append('bale_meter_capacity', this.f.bale_meter_capacity.value);
            formData.append('grain_meter_capacity', this.f.grain_meter_capacity.value);
            formData.append('bale_feet_capacity', this.f.bale_feet_capacity.value);
            formData.append('grain_feet_capacity', this.f.grain_feet_capacity.value);
            formData.append('holds', this.f.holds.value);
            formData.append('hatches', this.f.hatches.value);
            formData.append('gear', this.f.gear.value);
            formData.append('swl', this.f.swl.value);
            formData.append('loa', this.f.loa.value);
            formData.append('lbp', this.f.lbp.value);
            formData.append('beam', this.f.beam.value);
            formData.append('depth', this.f.depth.value);
            formData.append('tpc', this.f.tpc.value);
            formData.append('breadth_moulded', this.f.breadth_moulded.value);
            formData.append('displacement', this.f.displacement.value);
            formData.append('light_weight_tons', this.f.light_weight_tons.value);
            formData.append('block_coeficient', this.f.block_coeficient.value);
            formData.append('class_society', this.f.class_society.value);
            formData.append('main_engine_design', this.f.main_engine_design.value);
            formData.append('main_engine_type', this.f.main_engine_type.value);
            formData.append('aux_engine_design', this.f.aux_engine_design.value);
            formData.append('aux_engine_type', this.f.aux_engine_type.value);
            formData.append('power', this.f.power.value);
            formData.append('constants', this.f.constants.value);
            formData.append('flag', this.f.flag.value);
            formData.append('base', this.f.base.value);
            formData.append('smc_expiry_date', this.f.smc_expiry_date.value);
            formData.append('crew', this.f.crew.value);
            formData.append('crew_nationality', this.f.crew_nationality.value);
            formData.append('hull_material', this.f.hull_material.value);
            formData.append('decks_number', this.f.decks_number.value);
            formData.append('bulbows_bow', this.f.bulbows_bow.value);
            formData.append('dbl_bottom', this.f.dbl_bottom.value);
            formData.append('bollard_pull', this.f.bollard_pull.value);
            formData.append('dbl_deck', this.f.dbl_deck.value);
            formData.append('winches', this.f.winches.value);
            formData.append('dbl_side_skins', this.f.dbl_side_skins.value);
            formData.append('survey_month', this.f.survey_month.value);
            formData.append('survey_year', this.f.survey_year.value);
            formData.append('activity', this.f.activity.value);
            formData.append('officiers_nationality', this.f.officiers_nationality.value);
            formData.append('speed_laden_1', this.f.speed_laden_1.value);
            formData.append('laden_fuel_1', this.f.laden_fuel_1.value);
            formData.append('id_fuel_type_laden_1', this.f.id_fuel_type_laden_1.value);
            formData.append('speed_ballast_1', this.f.speed_ballast_1.value);
            formData.append('ballast_fuel_1', this.f.ballast_fuel_1.value);
            formData.append('id_fuel_type_ballast_1', this.f.id_fuel_type_ballast_1.value);
            formData.append('speed_laden_2', this.f.speed_laden_2.value);
            formData.append('laden_fuel_2', this.f.laden_fuel_2.value);
            formData.append('id_fuel_type_laden_2', this.f.id_fuel_type_laden_2.value);
            formData.append('speed_ballast_2', this.f.speed_ballast_2.value);
            formData.append('ballast_fuel_2', this.f.ballast_fuel_2.value);
            formData.append('id_fuel_type_ballast_2', this.f.id_fuel_type_ballast_2.value);
            formData.append('speed_laden_3', this.f.speed_laden_3.value);
            formData.append('laden_fuel_3', this.f.laden_fuel_3.value);
            formData.append('id_fuel_type_laden_3', this.f.id_fuel_type_laden_3.value);
            formData.append('speed_ballast_3', this.f.speed_ballast_3.value);
            formData.append('ballast_fuel_3', this.f.ballast_fuel_3.value);
            formData.append('id_fuel_type_ballast_3', this.f.id_fuel_type_ballast_3.value);
            formData.append('engine_hours', this.f.engine_hours.value);
            formData.append('fuel_aux_1', this.f.fuel_aux_1.value);
            formData.append('id_fuel_type_aux_1', this.f.id_fuel_type_aux_1.value);
            formData.append('fuel_aux_2', this.f.fuel_aux_2.value);
            formData.append('id_fuel_type_aux_2', this.f.id_fuel_type_aux_2.value);
            formData.append('fuel_aux_3', this.f.fuel_aux_3.value);
            formData.append('id_fuel_type_aux_3', this.f.id_fuel_type_aux_3.value);
            formData.append('consumption_value_1', this.f.consumption_value_1.value);
            formData.append('consumption_value_2', this.f.consumption_value_2.value);
            formData.append('company_background_sheet', this.company_background_sheet);
            formData.append('vessal_history_sheet', this.vessal_history_sheet);
            formData.append('operating_record_sheet', this.operating_record_sheet);    
            console.log(this.company_background_sheet);
            console.log(this.vessal_history_sheet);
            console.log(this.operating_record_sheet);
   
       
            console.log(formData);
            try {
                this._userService.updateVessel(formData)
                .pipe(first())
                .subscribe((res) => {
                    this.showLoaderImg = false;
                    this.createVesselRes = res;
                    if (this.createVesselRes.success === true) {
                        this.alertService.success(this.createVesselRes.message, 'Success');
                        this.editvesselForm.reset();
                        this.company_background_sheet=null;
                        this.vessal_history_sheet=null;
                        this.operating_record_sheet=null;
                    } else {
                        this.alertService.error(this.createVesselRes.message, 'Error');
                    }
                },
                err => {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
                
            } catch (err) {
                console.log(err);
            }
        }
      
    }


    PositionList(): void {
        try {
            this._userService.PositionList()
                .pipe(first())
                .subscribe((res) => {
                    this.PositionListRes = res;
                    console.log(res);
                    if (this.PositionListRes.success === true) {
                        this.PositionListData = this.PositionListRes.data;
                        console.log(this.PositionListData);
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                        console.log(err);
                    });

        } catch (err) {
            console.log(err);
        }
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    // edit show Modal
    firstModal(): void {
        this.firstModalStatus = !this.firstModalStatus;
    }

    addfuel(): void {
        this.firstModal();
    }
    addvessel(): void {
        this.secondModal();
    }
    secondModal(): void {
        this.secondModalStatus = !this.secondModalStatus;
    }

    // Country List
    stateList(): void {
        try {
            this._userService.getstateList()
            .pipe(first())
            .subscribe((res) => {
                this.stateListRes = res;
                if (this.stateListRes.success === true) {
                    this.stateListData = this.stateListRes.data;
                    console.log(this.stateListData);
                }
            },
            err => {
                console.log(err);
            });
            
        } catch (err) {
            console.log(err);
        }
    }

    // Ststus List Top Right
    statusList(): void {
        try {
            this._userService.getstatusList()
            .pipe(first())
            .subscribe((res) => {
                this.statusListRes = res;
                if (this.statusListRes.success === true) {
                    this.statusListData = this.statusListRes.data;
                    console.log(this.statusListData);
                }
            },
            err => {
                console.log(err);
            });
            
        } catch (err) {
            console.log(err);
        }
    }

   
    vesseldetail(): void {
        const vesselId = localStorage.getItem('vesselId');
        const req = {
            "id" :  vesselId
        }
        try {
            this._userService.getvesselDetail(req)
                .pipe(first())
                .subscribe((res) => {
                    this.vesseldetailListRes = res;
                    if (this.vesseldetailListRes.success === true) {
                        this.vesseldetailListData = this.vesseldetailListRes.data;
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                        console.log(err);
                    });
    
        } catch (err) {
            console.log(err);
        }
    }

    public selectedRoleList = [];
    public innerSelectData = [];
    changeSelectAccess(event, data): void {
        const checked = event.checked;
        console.log(event);
        console.log(data);
        for (let selectitem of this.roleAccessListData) {
            if (selectitem === data) {
                if (selectitem.selected === true) {
                    selectitem.selected = checked;
                    // this.selectedRoleList.push(selectitem);
                    for (let innerLoop of selectitem.alertdata) {
                        innerLoop.selected = true;
                    }
                } else {
                    var index = this.selectedRoleList.indexOf(selectitem);
                    this.selectedRoleList.splice(index, 1);
                    for (let innerLoop of selectitem.alertdata) {
                        innerLoop.selected = false;
                    }
                }

            } else {
                for (let innerList of selectitem.alertdata) {
                    // selectitem.selected = false;
                    if (selectitem.id === innerList.parentId) {
                        if (selectitem.selected === true) {
                            selectitem.selected = false;
                            var index = this.selectedRoleList.indexOf(selectitem);
                            this.selectedRoleList.splice(index, 1);

                        } else {
                            console.log('inner');
                            if (data.parentId === innerList.parentId && data.categoryName === innerList.categoryName) {
                                if (event.checked === true) {
                                    console.log('inner check');
                                    innerList.selected = checked;
                                    // this.innerSelectData.push(data);
                                } else {
                                    console.log('inner uncheck');
                                    innerList.selected = checked;
                                    var index = this.innerSelectData.indexOf(innerList);
                                    this.innerSelectData.splice(index, 1);
                                }
                            }

                        }
                    }

                }
            }
        }
    }

}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('repassword');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};