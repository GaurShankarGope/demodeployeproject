import { FuseUtils } from '@fuse/utils';
export class OFCManagement
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
     * @param OFCManagement
     */
    constructor(OFCManagement)
    {
        {
            this.id = OFCManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = OFCManagement.CPTypeId || '';
            this.formId = OFCManagement.formId || '';
            this.vesselId = OFCManagement.vesselId || '';
            this.ownerId = OFCManagement.ownerId || '';
            this.chartererId = OFCManagement.chartererId || '';
            this.chartererBrokerId = OFCManagement.chartererBrokerId || '';
            this.ownerBrokerId = OFCManagement.ownerBrokerId || '';
            this.cpDate = OFCManagement.cpDate || '';
            this.cpTime = OFCManagement.cpTime || '';
            this.cpCity = OFCManagement.cpCity || '';
            this.cpSubject = OFCManagement.cpSubject || '';
            this.cpLiftDate = OFCManagement.cpLiftDate || '';
            this.cpLiftTime = OFCManagement.cpLiftTime || '';
            this.cpLiftCity = OFCManagement.cpLiftCity || '';

            this.createdBy = OFCManagement.createdBy || '';
            this.createdAt = OFCManagement.createdAt || '';
            this.updatedBy = OFCManagement.updatedBy || '';
            this.updatedAt = OFCManagement.updatedAt || '';
            this.isActive = OFCManagement.isActive || '';
            this.isDelete = OFCManagement.isDelete || '';
        }
    }
}