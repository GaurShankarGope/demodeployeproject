import { FuseUtils } from '@fuse/utils';
export class RecapManagement
{
    id: string;
    
    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;

    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param RecapManagement
     */
    constructor(RecapManagement)
    {
        {
            this.id = RecapManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = RecapManagement.CPTypeId || '';
            this.formId = RecapManagement.formId || '';
            this.vesselId = RecapManagement.vesselId || '';
            this.ownerId = RecapManagement.ownerId || '';
            this.chartererId = RecapManagement.chartererId || '';
            this.chartererBrokerId = RecapManagement.chartererBrokerId || '';
            this.ownerBrokerId = RecapManagement.ownerBrokerId || '';
            this.cpDate = RecapManagement.cpDate || '';
            this.cpTime = RecapManagement.cpTime || '';
            this.cpCity = RecapManagement.cpCity || '';
            this.cpSubject = RecapManagement.cpSubject || '';
            this.cpLiftDate = RecapManagement.cpLiftDate || '';
            this.cpLiftTime = RecapManagement.cpLiftTime || '';
            this.cpLiftCity = RecapManagement.cpLiftCity || '';

            this.createdBy = RecapManagement.createdBy || '';
            this.createdAt = RecapManagement.createdAt || '';
            this.updatedBy = RecapManagement.updatedBy || '';
            this.updatedAt = RecapManagement.updatedAt || '';
            this.isActive = RecapManagement.isActive || '';
            this.isDelete = RecapManagement.isDelete || '';
        }
    }
}