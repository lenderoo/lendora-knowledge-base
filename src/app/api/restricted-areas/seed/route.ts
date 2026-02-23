import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create authenticated Supabase client with email/password
async function createAuthenticatedClient(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }

  return supabase;
}

interface SeedRequestBody {
  email: string;
  password: string;
}

// 受限区域种子数据
const SEED_DATA = [
  // ==================== 高密度公寓区域 (NSW) ====================
  {
    suburb: "Sydney CBD",
    postcode: "2000",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "CBD高密度公寓区，供应量大，部分楼盘限制",
    affected_lenders: ["CBA", "Westpac"],
    max_lvr: 80,
    notes: "需检查具体楼盘是否在限制名单",
  },
  {
    suburb: "Zetland",
    postcode: "2017",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度开发区，公寓供应过剩",
    affected_lenders: ["CBA", "Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Waterloo",
    postcode: "2017",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度开发区，价值波动风险",
    affected_lenders: ["CBA", "Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Mascot",
    postcode: "2020",
    state: "NSW",
    restriction_level: "RESTRICTED",
    category: "BUILDING_DEFECT",
    reason: "Opal Tower/Mascot Towers事件后的建筑质量担忧",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
    notes: "特定楼盘完全不接受",
  },
  {
    suburb: "Parramatta",
    postcode: "2150",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "CBD外围高密度开发，供应增加",
    affected_lenders: ["Westpac"],
    max_lvr: 80,
  },
  {
    suburb: "Epping",
    postcode: "2121",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "轨道交通开发带来大量公寓供应",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Chatswood",
    postcode: "2067",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度开发，海外买家集中",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Rhodes",
    postcode: "2138",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区",
    affected_lenders: ["CBA", "Westpac"],
    max_lvr: 80,
  },
  {
    suburb: "Wentworth Point",
    postcode: "2127",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "Olympic Park周边高密度开发",
    affected_lenders: ["CBA", "Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Homebush",
    postcode: "2140",
    state: "NSW",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },

  // ==================== 高密度公寓区域 (VIC) ====================
  {
    suburb: "Melbourne CBD",
    postcode: "3000",
    state: "VIC",
    restriction_level: "RESTRICTED",
    category: "HIGH_DENSITY",
    reason: "CBD高密度公寓过剩，空置率高，Airbnb影响",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
    notes: "小面积公寓(<50sqm)可能被拒绝",
  },
  {
    suburb: "Southbank",
    postcode: "3006",
    state: "VIC",
    restriction_level: "RESTRICTED",
    category: "HIGH_DENSITY",
    reason: "高层公寓集中区，供应过剩严重",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
  },
  {
    suburb: "Docklands",
    postcode: "3008",
    state: "VIC",
    restriction_level: "RESTRICTED",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区，价值波动大，空置率高",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
    notes: "部分老楼盘有建筑缺陷问题",
  },
  {
    suburb: "Carlton",
    postcode: "3053",
    state: "VIC",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "学生公寓区，海外买家集中",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "South Yarra",
    postcode: "3141",
    state: "VIC",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度开发区域",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Box Hill",
    postcode: "3128",
    state: "VIC",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "快速高密度化，海外买家集中",
    affected_lenders: ["CBA", "Westpac"],
    max_lvr: 80,
  },
  {
    suburb: "Clayton",
    postcode: "3168",
    state: "VIC",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "Monash大学区，学生公寓多",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Footscray",
    postcode: "3011",
    state: "VIC",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "快速开发区，公寓供应增加",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },

  // ==================== 高密度公寓区域 (QLD) ====================
  {
    suburb: "Brisbane CBD",
    postcode: "4000",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "CBD公寓供应增加",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "South Brisbane",
    postcode: "4101",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度开发区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Fortitude Valley",
    postcode: "4006",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Surfers Paradise",
    postcode: "4217",
    state: "QLD",
    restriction_level: "RESTRICTED",
    category: "HIGH_DENSITY",
    reason: "度假公寓区，短租影响，价值波动大",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
  },
  {
    suburb: "Broadbeach",
    postcode: "4218",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "度假公寓区，短租影响",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Main Beach",
    postcode: "4217",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "度假公寓区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },

  // ==================== 高密度公寓区域 (WA) ====================
  {
    suburb: "Perth CBD",
    postcode: "6000",
    state: "WA",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "CBD公寓，矿业周期影响",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "East Perth",
    postcode: "6004",
    state: "WA",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "West Perth",
    postcode: "6005",
    state: "WA",
    restriction_level: "WATCHLIST",
    category: "HIGH_DENSITY",
    reason: "高密度公寓区",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },

  // ==================== 矿业小镇 (QLD) ====================
  {
    suburb: "Moranbah",
    postcode: "4744",
    state: "QLD",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇，房价随煤价剧烈波动，2012-2016年跌幅超60%",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie"],
    max_lvr: 60,
    notes: "部分银行完全不接受",
  },
  {
    suburb: "Dysart",
    postcode: "4745",
    state: "QLD",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇，人口依赖矿业就业",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Middlemount",
    postcode: "4746",
    state: "QLD",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Blackwater",
    postcode: "4717",
    state: "QLD",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 65,
  },
  {
    suburb: "Emerald",
    postcode: "4720",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "矿业服务中心，受矿业周期影响",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Gladstone",
    postcode: "4680",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "LNG/矿业港口城市，周期性波动",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Mackay",
    postcode: "4740",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "矿业服务城市",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },
  {
    suburb: "Rockhampton",
    postcode: "4700",
    state: "QLD",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "矿业/农业区域中心",
    affected_lenders: ["Westpac"],
    max_lvr: 85,
  },

  // ==================== 矿业小镇 (WA - Pilbara) ====================
  {
    suburb: "Port Hedland",
    postcode: "6721",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "铁矿石矿业小镇，房价极度波动",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie"],
    max_lvr: 50,
    notes: "2012年均价$120万，2017年跌至$20万",
  },
  {
    suburb: "South Hedland",
    postcode: "6722",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 50,
  },
  {
    suburb: "Karratha",
    postcode: "6714",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业/LNG小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Newman",
    postcode: "6753",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "BHP矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Tom Price",
    postcode: "6751",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "Rio Tinto矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Paraburdoo",
    postcode: "6754",
    state: "WA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Kalgoorlie",
    postcode: "6430",
    state: "WA",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "金矿城市，有一定经济多元化",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },

  // ==================== 矿业小镇 (SA) ====================
  {
    suburb: "Roxby Downs",
    postcode: "5725",
    state: "SA",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "Olympic Dam矿业小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 60,
  },
  {
    suburb: "Whyalla",
    postcode: "5600",
    state: "SA",
    restriction_level: "WATCHLIST",
    category: "MINING_TOWN",
    reason: "钢铁/矿业城市",
    affected_lenders: ["Westpac"],
    max_lvr: 80,
  },

  // ==================== 偏远地区 (NT) ====================
  {
    suburb: "Darwin CBD",
    postcode: "0800",
    state: "NT",
    restriction_level: "WATCHLIST",
    category: "REMOTE_AREA",
    reason: "人口少，市场流动性差",
    affected_lenders: ["Westpac"],
    max_lvr: 80,
  },
  {
    suburb: "Alice Springs",
    postcode: "0870",
    state: "NT",
    restriction_level: "WATCHLIST",
    category: "REMOTE_AREA",
    reason: "偏远地区，市场流动性有限",
    affected_lenders: ["Westpac", "ANZ"],
    max_lvr: 80,
  },
  {
    suburb: "Katherine",
    postcode: "0850",
    state: "NT",
    restriction_level: "RESTRICTED",
    category: "REMOTE_AREA",
    reason: "偏远小镇",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 70,
  },

  // ==================== 偏远地区 (TAS) ====================
  {
    suburb: "Queenstown",
    postcode: "7467",
    state: "TAS",
    restriction_level: "RESTRICTED",
    category: "MINING_TOWN",
    reason: "矿业小镇，人口流失",
    affected_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    max_lvr: 65,
  },
];

export async function POST(request: Request) {
  try {
    const body: SeedRequestBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Missing email or password",
          usage:
            "curl -X POST -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}' http://localhost:3000/api/restricted-areas/seed",
        },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    // Check existing data count
    const { count: existingCount } = await supabase
      .from("restricted_areas")
      .select("*", { count: "exact", head: true });

    // Insert seed data in batches
    const batchSize = 20;
    let totalInserted = 0;

    for (let i = 0; i < SEED_DATA.length; i += batchSize) {
      const batch = SEED_DATA.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from("restricted_areas")
        .insert(batch)
        .select();

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
            insertedSoFar: totalInserted,
            failedAt: i,
          },
          { status: 500 }
        );
      }

      totalInserted += data.length;
    }

    return NextResponse.json({
      message: `Successfully seeded ${totalInserted} restricted areas`,
      existingBefore: existingCount || 0,
      inserted: totalInserted,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Missing email or password",
          usage:
            "curl 'http://localhost:3000/api/restricted-areas/seed?email=your@email.com&password=yourpassword'",
        },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    const { count, error } = await supabase
      .from("restricted_areas")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      currentCount: count || 0,
      seedDataCount: SEED_DATA.length,
      message: "Use POST to insert seed data, DELETE to clear all data",
    });
  } catch (error) {
    console.error("Check seed status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body: SeedRequestBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Missing email or password",
          usage:
            "curl -X DELETE -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}' http://localhost:3000/api/restricted-areas/seed",
        },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    const { error } = await supabase
      .from("restricted_areas")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully cleared all restricted areas",
    });
  } catch (error) {
    console.error("Clear error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
