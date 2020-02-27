import { FuseUtils } from '@fuse/utils';
export class TradingPlatformManagement
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
     * @param TradingPlatformManagement
     */
    constructor(TradingPlatformManagement)
    {
        {
            this.id = TradingPlatformManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = TradingPlatformManagement.CPTypeId || '';
            this.formId = TradingPlatformManagement.formId || '';
            this.vesselId = TradingPlatformManagement.vesselId || '';
            this.ownerId = TradingPlatformManagement.ownerId || '';
            this.chartererId = TradingPlatformManagement.chartererId || '';
            this.chartererBrokerId = TradingPlatformManagement.chartererBrokerId || '';
            this.ownerBrokerId = TradingPlatformManagement.ownerBrokerId || '';
            this.cpDate = TradingPlatformManagement.cpDate || '';
            this.cpTime = TradingPlatformManagement.cpTime || '';
            this.cpCity = TradingPlatformManagement.cpCity || '';
            this.cpSubject = TradingPlatformManagement.cpSubject || '';
            this.cpLiftDate = TradingPlatformManagement.cpLiftDate || '';
            this.cpLiftTime = TradingPlatformManagement.cpLiftTime || '';
            this.cpLiftCity = TradingPlatformManagement.cpLiftCity || '';

            this.createdBy = TradingPlatformManagement.createdBy || '';
            this.createdAt = TradingPlatformManagement.createdAt || '';
            this.updatedBy = TradingPlatformManagement.updatedBy || '';
            this.updatedAt = TradingPlatformManagement.updatedAt || '';
            this.isActive = TradingPlatformManagement.isActive || '';
            this.isDelete = TradingPlatformManagement.isDelete || '';
        }
    }
}