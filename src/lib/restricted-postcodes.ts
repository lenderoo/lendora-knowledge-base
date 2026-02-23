// 澳洲银行贷款受限区域列表
// 数据来源：各银行 Postcode Restriction Policy
// 更新日期：2024年

export interface RestrictedArea {
  suburb: string;
  postcode: string;
  state: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";
  restrictionLevel: "RESTRICTED" | "WATCHLIST";
  reason: string;
  affectedLenders: string[];
  maxLvr?: number; // 部分银行可能有LVR限制
  notes?: string;
}

// ==================== 高密度公寓区域 (High Density Areas) ====================
// 这些区域因公寓供应过剩、价值波动大而受限

export const HIGH_DENSITY_AREAS: RestrictedArea[] = [
  // NSW - Sydney CBD & Surrounds
  {
    suburb: "Sydney CBD",
    postcode: "2000",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "CBD高密度公寓区，供应量大，部分楼盘限制",
    affectedLenders: ["CBA", "Westpac"],
    maxLvr: 80,
    notes: "需检查具体楼盘是否在限制名单",
  },
  {
    suburb: "Zetland",
    postcode: "2017",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "高密度开发区，公寓供应过剩",
    affectedLenders: ["CBA", "Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Waterloo",
    postcode: "2017",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "高密度开发区，价值波动风险",
    affectedLenders: ["CBA", "Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Mascot",
    postcode: "2020",
    state: "NSW",
    restrictionLevel: "RESTRICTED",
    reason: "Opal Tower/Mascot Towers事件后的建筑质量担忧",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
    notes: "特定楼盘完全不接受",
  },
  {
    suburb: "Parramatta",
    postcode: "2150",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "CBD外围高密度开发，供应增加",
    affectedLenders: ["Westpac"],
    maxLvr: 80,
  },
  {
    suburb: "Epping",
    postcode: "2121",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "轨道交通开发带来大量公寓供应",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Chatswood",
    postcode: "2067",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "高密度开发，海外买家集中",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Rhodes",
    postcode: "2138",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "高密度公寓区",
    affectedLenders: ["CBA", "Westpac"],
    maxLvr: 80,
  },
  {
    suburb: "Wentworth Point",
    postcode: "2127",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "Olympic Park周边高密度开发",
    affectedLenders: ["CBA", "Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Homebush",
    postcode: "2140",
    state: "NSW",
    restrictionLevel: "WATCHLIST",
    reason: "高密度公寓区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },

  // VIC - Melbourne CBD & Surrounds
  {
    suburb: "Melbourne CBD",
    postcode: "3000",
    state: "VIC",
    restrictionLevel: "RESTRICTED",
    reason: "CBD高密度公寓过剩，空置率高，Airbnb影响",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
    notes: "小面积公寓(<50sqm)可能被拒绝",
  },
  {
    suburb: "Southbank",
    postcode: "3006",
    state: "VIC",
    restrictionLevel: "RESTRICTED",
    reason: "高层公寓集中区，供应过剩严重",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
  },
  {
    suburb: "Docklands",
    postcode: "3008",
    state: "VIC",
    restrictionLevel: "RESTRICTED",
    reason: "高密度公寓区，价值波动大，空置率高",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
    notes: "部分老楼盘有建筑缺陷问题",
  },
  {
    suburb: "Carlton",
    postcode: "3053",
    state: "VIC",
    restrictionLevel: "WATCHLIST",
    reason: "学生公寓区，海外买家集中",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "South Yarra",
    postcode: "3141",
    state: "VIC",
    restrictionLevel: "WATCHLIST",
    reason: "高密度开发区域",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Box Hill",
    postcode: "3128",
    state: "VIC",
    restrictionLevel: "WATCHLIST",
    reason: "快速高密度化，海外买家集中",
    affectedLenders: ["CBA", "Westpac"],
    maxLvr: 80,
  },
  {
    suburb: "Clayton",
    postcode: "3168",
    state: "VIC",
    restrictionLevel: "WATCHLIST",
    reason: "Monash大学区，学生公寓多",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Footscray",
    postcode: "3011",
    state: "VIC",
    restrictionLevel: "WATCHLIST",
    reason: "快速开发区，公寓供应增加",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },

  // QLD - Brisbane & Gold Coast
  {
    suburb: "Brisbane CBD",
    postcode: "4000",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "CBD公寓供应增加",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "South Brisbane",
    postcode: "4101",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "高密度开发区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Fortitude Valley",
    postcode: "4006",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "高密度公寓区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Surfers Paradise",
    postcode: "4217",
    state: "QLD",
    restrictionLevel: "RESTRICTED",
    reason: "度假公寓区，短租影响，价值波动大",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
  },
  {
    suburb: "Broadbeach",
    postcode: "4218",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "度假公寓区，短租影响",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Main Beach",
    postcode: "4217",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "度假公寓区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },

  // WA - Perth
  {
    suburb: "Perth CBD",
    postcode: "6000",
    state: "WA",
    restrictionLevel: "WATCHLIST",
    reason: "CBD公寓，矿业周期影响",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "East Perth",
    postcode: "6004",
    state: "WA",
    restrictionLevel: "WATCHLIST",
    reason: "高密度公寓区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "West Perth",
    postcode: "6005",
    state: "WA",
    restrictionLevel: "WATCHLIST",
    reason: "高密度公寓区",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
];

// ==================== 矿业小镇 (Mining Towns) ====================
// 这些区域因矿业周期波动而受限

export const MINING_TOWNS: RestrictedArea[] = [
  // QLD - Bowen Basin (Coal Mining)
  {
    suburb: "Moranbah",
    postcode: "4744",
    state: "QLD",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇，房价随煤价剧烈波动，2012-2016年跌幅超60%",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie"],
    maxLvr: 60,
    notes: "部分银行完全不接受",
  },
  {
    suburb: "Dysart",
    postcode: "4745",
    state: "QLD",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇，人口依赖矿业就业",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Middlemount",
    postcode: "4746",
    state: "QLD",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Blackwater",
    postcode: "4717",
    state: "QLD",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 65,
  },
  {
    suburb: "Emerald",
    postcode: "4720",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "矿业服务中心，受矿业周期影响",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Gladstone",
    postcode: "4680",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "LNG/矿业港口城市，周期性波动",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Mackay",
    postcode: "4740",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "矿业服务城市",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },
  {
    suburb: "Rockhampton",
    postcode: "4700",
    state: "QLD",
    restrictionLevel: "WATCHLIST",
    reason: "矿业/农业区域中心",
    affectedLenders: ["Westpac"],
    maxLvr: 85,
  },

  // WA - Pilbara (Iron Ore Mining)
  {
    suburb: "Port Hedland",
    postcode: "6721",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "铁矿石矿业小镇，房价极度波动",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie"],
    maxLvr: 50,
    notes: "2012年均价$120万，2017年跌至$20万",
  },
  {
    suburb: "South Hedland",
    postcode: "6722",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 50,
  },
  {
    suburb: "Karratha",
    postcode: "6714",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "矿业/LNG小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Newman",
    postcode: "6753",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "BHP矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Tom Price",
    postcode: "6751",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "Rio Tinto矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Paraburdoo",
    postcode: "6754",
    state: "WA",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },

  // WA - Goldfields
  {
    suburb: "Kalgoorlie",
    postcode: "6430",
    state: "WA",
    restrictionLevel: "WATCHLIST",
    reason: "金矿城市，有一定经济多元化",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },

  // SA - Mining
  {
    suburb: "Roxby Downs",
    postcode: "5725",
    state: "SA",
    restrictionLevel: "RESTRICTED",
    reason: "Olympic Dam矿业小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 60,
  },
  {
    suburb: "Whyalla",
    postcode: "5600",
    state: "SA",
    restrictionLevel: "WATCHLIST",
    reason: "钢铁/矿业城市",
    affectedLenders: ["Westpac"],
    maxLvr: 80,
  },
];

// ==================== 偏远地区 (Remote Areas) ====================

export const REMOTE_AREAS: RestrictedArea[] = [
  // NT
  {
    suburb: "Darwin CBD",
    postcode: "0800",
    state: "NT",
    restrictionLevel: "WATCHLIST",
    reason: "人口少，市场流动性差",
    affectedLenders: ["Westpac"],
    maxLvr: 80,
  },
  {
    suburb: "Alice Springs",
    postcode: "0870",
    state: "NT",
    restrictionLevel: "WATCHLIST",
    reason: "偏远地区，市场流动性有限",
    affectedLenders: ["Westpac", "ANZ"],
    maxLvr: 80,
  },
  {
    suburb: "Katherine",
    postcode: "0850",
    state: "NT",
    restrictionLevel: "RESTRICTED",
    reason: "偏远小镇",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 70,
  },

  // TAS - Regional
  {
    suburb: "Queenstown",
    postcode: "7467",
    state: "TAS",
    restrictionLevel: "RESTRICTED",
    reason: "矿业小镇，人口流失",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB"],
    maxLvr: 65,
  },
];

// ==================== 建筑缺陷问题区域 ====================

export const BUILDING_DEFECT_AREAS: RestrictedArea[] = [
  {
    suburb: "Mascot (Opal Tower vicinity)",
    postcode: "2020",
    state: "NSW",
    restrictionLevel: "RESTRICTED",
    reason: "Opal Tower建筑缺陷事件，周边楼盘被审查",
    affectedLenders: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie"],
    maxLvr: 70,
    notes: "需要获取建筑合规报告",
  },
];

// ==================== 合并所有受限区域 ====================

export const ALL_RESTRICTED_AREAS: RestrictedArea[] = [
  ...HIGH_DENSITY_AREAS,
  ...MINING_TOWNS,
  ...REMOTE_AREAS,
  ...BUILDING_DEFECT_AREAS,
];

// ==================== 辅助函数 ====================

// 根据postcode查询限制信息
export function getRestrictionByPostcode(postcode: string): RestrictedArea | undefined {
  return ALL_RESTRICTED_AREAS.find((area) => area.postcode === postcode);
}

// 根据suburb查询限制信息
export function getRestrictionBySuburb(suburb: string): RestrictedArea | undefined {
  return ALL_RESTRICTED_AREAS.find(
    (area) => area.suburb.toLowerCase().includes(suburb.toLowerCase())
  );
}

// 获取某银行的所有受限区域
export function getRestrictedAreasForLender(lender: string): RestrictedArea[] {
  return ALL_RESTRICTED_AREAS.filter((area) =>
    area.affectedLenders.includes(lender)
  );
}

// 获取所有RESTRICTED级别的区域
export function getStrictlyRestrictedAreas(): RestrictedArea[] {
  return ALL_RESTRICTED_AREAS.filter(
    (area) => area.restrictionLevel === "RESTRICTED"
  );
}

// 获取所有WATCHLIST级别的区域
export function getWatchlistAreas(): RestrictedArea[] {
  return ALL_RESTRICTED_AREAS.filter(
    (area) => area.restrictionLevel === "WATCHLIST"
  );
}

// 检查某区域对某银行是否可贷
export function canLendInArea(
  postcode: string,
  lender: string,
  requestedLvr: number
): { canLend: boolean; reason?: string; maxLvr?: number } {
  const restriction = getRestrictionByPostcode(postcode);

  if (!restriction) {
    return { canLend: true };
  }

  if (!restriction.affectedLenders.includes(lender)) {
    return { canLend: true };
  }

  if (restriction.restrictionLevel === "RESTRICTED") {
    if (restriction.maxLvr && requestedLvr > restriction.maxLvr) {
      return {
        canLend: false,
        reason: `${restriction.reason}. 最高LVR: ${restriction.maxLvr}%`,
        maxLvr: restriction.maxLvr,
      };
    }
    return {
      canLend: true,
      reason: `注意: ${restriction.reason}`,
      maxLvr: restriction.maxLvr,
    };
  }

  // WATCHLIST
  return {
    canLend: true,
    reason: `观察名单: ${restriction.reason}`,
    maxLvr: restriction.maxLvr,
  };
}
