import { FuseUtils } from '@fuse/utils';
export class SettingsManagement
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
     * @param SettingsManagement
     */
    constructor(SettingsManagement)
    {
        {
            this.id = SettingsManagement.id || FuseUtils.generateGUID();
            
            this.CPTypeId = SettingsManagement.CPTypeId || '';
            this.formId = SettingsManagement.formId || '';
            this.vesselId = SettingsManagement.vesselId || '';
            this.ownerId = SettingsManagement.ownerId || '';
            this.chartererId = SettingsManagement.chartererId || '';
            this.chartererBrokerId = SettingsManagement.chartererBrokerId || '';
            this.ownerBrokerId = SettingsManagement.ownerBrokerId || '';
            this.cpDate = SettingsManagement.cpDate || '';
            this.cpTime = SettingsManagement.cpTime || '';
            this.cpCity = SettingsManagement.cpCity || '';
            this.cpSubject = SettingsManagement.cpSubject || '';
            this.cpLiftDate = SettingsManagement.cpLiftDate || '';
            this.cpLiftTime = SettingsManagement.cpLiftTime || '';
            this.cpLiftCity = SettingsManagement.cpLiftCity || '';

            this.createdBy = SettingsManagement.createdBy || '';
            this.createdAt = SettingsManagement.createdAt || '';
            this.updatedBy = SettingsManagement.updatedBy || '';
            this.updatedAt = SettingsManagement.updatedAt || '';
            this.isActive = SettingsManagement.isActive || '';
            this.isDelete = SettingsManagement.isDelete || '';
        }
    }
}