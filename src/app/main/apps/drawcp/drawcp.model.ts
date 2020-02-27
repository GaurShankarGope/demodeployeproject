import { FuseUtils } from '@fuse/utils';
export class DrawCPManagement
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
     * @param DrawCPManagement
     */
    constructor(DrawCPManagement)
    {
        {
            this.id = DrawCPManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = DrawCPManagement.CPTypeId || '';
            this.formId = DrawCPManagement.formId || '';
            this.vesselId = DrawCPManagement.vesselId || '';
            this.ownerId = DrawCPManagement.ownerId || '';
            this.chartererId = DrawCPManagement.chartererId || '';
            this.chartererBrokerId = DrawCPManagement.chartererBrokerId || '';
            this.ownerBrokerId = DrawCPManagement.ownerBrokerId || '';
            this.cpDate = DrawCPManagement.cpDate || '';
            this.cpTime = DrawCPManagement.cpTime || '';
            this.cpCity = DrawCPManagement.cpCity || '';
            this.cpSubject = DrawCPManagement.cpSubject || '';
            this.cpLiftDate = DrawCPManagement.cpLiftDate || '';
            this.cpLiftTime = DrawCPManagement.cpLiftTime || '';
            this.cpLiftCity = DrawCPManagement.cpLiftCity || '';

            this.createdBy = DrawCPManagement.createdBy || '';
            this.createdAt = DrawCPManagement.createdAt || '';
            this.updatedBy = DrawCPManagement.updatedBy || '';
            this.updatedAt = DrawCPManagement.updatedAt || '';
            this.isActive = DrawCPManagement.isActive || '';
            this.isDelete = DrawCPManagement.isDelete || '';
        }
    }
}