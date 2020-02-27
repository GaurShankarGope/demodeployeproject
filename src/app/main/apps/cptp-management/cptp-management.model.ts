import { FuseUtils } from '@fuse/utils';
export class CPTPManagement
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
     * @param CPTPManagement
     */
    constructor(CPTPManagement)
    {
        {
            this.id = CPTPManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = CPTPManagement.CPTypeId || '';
            this.formId = CPTPManagement.formId || '';
            this.vesselId = CPTPManagement.vesselId || '';
            this.ownerId = CPTPManagement.ownerId || '';
            this.chartererId = CPTPManagement.chartererId || '';
            this.chartererBrokerId = CPTPManagement.chartererBrokerId || '';
            this.ownerBrokerId = CPTPManagement.ownerBrokerId || '';
            this.cpDate = CPTPManagement.cpDate || '';
            this.cpTime = CPTPManagement.cpTime || '';
            this.cpCity = CPTPManagement.cpCity || '';
            this.cpSubject = CPTPManagement.cpSubject || '';
            this.cpLiftDate = CPTPManagement.cpLiftDate || '';
            this.cpLiftTime = CPTPManagement.cpLiftTime || '';
            this.cpLiftCity = CPTPManagement.cpLiftCity || '';

            this.createdBy = CPTPManagement.createdBy || '';
            this.createdAt = CPTPManagement.createdAt || '';
            this.updatedBy = CPTPManagement.updatedBy || '';
            this.updatedAt = CPTPManagement.updatedAt || '';
            this.isActive = CPTPManagement.isActive || '';
            this.isDelete = CPTPManagement.isDelete || '';
        }
    }
}