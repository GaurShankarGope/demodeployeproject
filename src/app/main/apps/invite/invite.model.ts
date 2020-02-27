import { FuseUtils } from '@fuse/utils';
export class DrawManagement
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
     * @param DrawManagement
     */
    constructor(DrawManagement)
    {
        {
            this.id = DrawManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = DrawManagement.CPTypeId || '';
            this.formId = DrawManagement.formId || '';
            this.vesselId = DrawManagement.vesselId || '';
            this.ownerId = DrawManagement.ownerId || '';
            this.chartererId = DrawManagement.chartererId || '';
            this.chartererBrokerId = DrawManagement.chartererBrokerId || '';
            this.ownerBrokerId = DrawManagement.ownerBrokerId || '';
            this.cpDate = DrawManagement.cpDate || '';
            this.cpTime = DrawManagement.cpTime || '';
            this.cpCity = DrawManagement.cpCity || '';
            this.cpSubject = DrawManagement.cpSubject || '';
            this.cpLiftDate = DrawManagement.cpLiftDate || '';
            this.cpLiftTime = DrawManagement.cpLiftTime || '';
            this.cpLiftCity = DrawManagement.cpLiftCity || '';

            this.createdBy = DrawManagement.createdBy || '';
            this.createdAt = DrawManagement.createdAt || '';
            this.updatedBy = DrawManagement.updatedBy || '';
            this.updatedAt = DrawManagement.updatedAt || '';
            this.isActive = DrawManagement.isActive || '';
            this.isDelete = DrawManagement.isDelete || '';
        }
    }
}