import request from "@/services/request";

export default async () =>
  request("/api/Aliyun/WD_ALI_GetAliSTS", {
    data: {}
  });
