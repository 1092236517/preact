import request from "@/services/request";

// 商家详情
export async function getDetail(data) {
  return request("/api/LS_RecruitServicesManager/GetRecruitDetail", {
    data
  });
}

// 获取区域
export async function getArea(data) {
  return request("/api/LS_CommServiceManager/GetZpAreaList", {
    data
  });
}

// 获取验证码
export async function getCode(data) {
  return request("/api/LS_CommServiceManager/GetVCode", {
    data
  });
}

// 提交岗位申请
export async function applyPost(data) {
  return request("/api/LS_RecruitServicesManager/PersonalApplyRecruit", {
    data
  });
}

// 保存简历
export async function saveResume(data) {
  return request("/api/LS_PersonalServicesManager/UpdateSavePersonalInfo", {
    data
  });
}

// 获取简历
export async function getResume(data) {
  return request("/api/LS_PersonalServicesManager/GetPersonalInfo", {
    data
  });
}

// 获取职位
export async function getPost(data) {
  return request(
    "/api/LS_CommServiceManager/GetIndustryAndProfessionalTypeList",
    {
      data
    }
  );
}

// 首页列表
export async function getList(data) {
  return request("/api/LS_RecruitDataManager/GetRecruitList", {
    data
  });
}

// 用户行为埋点记录
export function happenCounts(data) {
  return request("/api/LS_CommDataManager/SaveHappenCounts", {
    data
  });
}

// 获取经纪人信息
export function getBroker(data) {
  return request("/api/LS_CommDataManager/GetBrokerInfoByBrokerID", {
    data
  });
}

// 获取经纪人排行前5信息
export function getTop5BrokerList(data) {
  return request("/api/LS_RecruitServicesManager/GetTop5BrokerList", {
    data
  });
}

// 用户绑定经纪人
export function brokerShareBind(data) {
  return request("/api/LS_PersonalServicesManager/PersonalFromBrokerLink", {
    data
  });
}

// 获取分享卡片的文案
export function getShareText(data) {
  return request("/api/LS_CommServiceManager/ShareArticle", {
    data
  });
}

// 获取分享卡片的文案
export function getWXShareParam(data) {
  return request("/api/LS_CommServiceManager/WechatShareGetAccessToken", {
    data
  });
}

// 获取分享卡片的文案
export function giveMeYouCode(data) {
  return request("/api/LS_CommServiceManager/GiveMeYouCode", {
    data
  });
}

// 获取收益排行
export function getRank(data) {
  return request("/api/TJ_RecommendServicesManager/GetYesterdayRank", {
    data
  });
}

// 获取会员分享信息
export function getMemberInfo(data) {
  return request("/api/TJ_RecommendServicesManager/GetMemberInfo", {
    data
  });
}

// 获取当前制造业排行第一的经纪人信息
export function getTopAdvertisementInfo(data) {
  return request("/api/LS_RecruitServicesManager/GetTopAdvertisementInfo", {
    data
  });
}

// 获取经纪人信息 是否参加微信群分享排名红包活动（0-不参加 1-参加）
export function getBrokerInfoByBrokerID(data) {
  return request("/api/LS_CommDataManager/GetBrokerInfoByBrokerID", {
    data
  });
}

export function shareMemberId(data) {
  return request("/api/TJ_RecommendServicesManager/ShareMemberId", {
    data
  });
}
// 广告位增加点击次数
export function addClickSumInBrokerADAction(data) {
  return request("/apiv1/addClickSumInBrokerADPage", {
    data
  });
}

export function brokerHaveMember(data) {
  return request("/api/LS_PersonalDataManager/BrokerHaveMember", {
    data
  });
}

// 记录经纪人浏览量访问明细 - 公众号制造业 和 H5
export function getRecordBrokerVisterDetail(data) {
  return request("/apiv1/recordBrokerVisterDetail", {
    data
  });
}

// 收集会员反馈意见（内容全客户端填充）
export function collectPersonalFeedbackDataFromClinet(data) {
  return request("/api/LS_PersonalServicesManager/CollectPersonalFeedbackDataFromClinet", {
    data
  });
}

export function uploadFileToOss(data) {
  return request("/api/LS_UploadToolManager/UploadFileToOss", {
    data
  });
}

export function getPersonalRecruitList(data) {
  return request("/api/LS_PersonalServicesManager/GetPersonalRecruitList", {
    data
  });
}

export function newPersonalFeedbackMessage(data) {
  return request("/api/LS_PersonalServicesManager/NewPersonalFeedbackMessage", {
    data
  });
}

