import {
  think
} from 'thinkjs';
import wx_service_base from './wx_service_base'; 

const wx_service_object = new wx_service_base(
  'wx33d82f168cad98c8',
  'a27e7213ceb910c46a48d02b5fe0dea0',
  '1526014191',
  'BJZLYCAREhiejl34n53kCCXPE9485912',
  '/wxRechargeNotify')

module.exports = wx_service_object;