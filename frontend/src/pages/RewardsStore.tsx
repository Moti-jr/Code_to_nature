import React, { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { 
  Gift, 
  Coins, 
  TreePine, 
  Package, 
  Calendar, 
  CheckCircle,
  Leaf,
  Trees,
  Sprout,
  Award,
  Coffee,
  ShoppingBag,
  Heart
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../hooks/use-toast"

// Define types for our data
interface Reward {
  id: string
  name: string
  description: string
  cost: number
  category: "Environmental" | "Merchandise" | "Digital"
  icon: React.JSX.Element
  available: boolean
  popular: boolean
}

interface Redemption {
  id: string
  userId: string
  rewardId: string
  rewardName: string
  cost: number
  date: string
}

// Mock data
const mockRewards: Reward[] = [
  {
    id: "1",
    name: "Plant a Tree",
    description: "We'll plant a real tree in your name in a reforestation project",
    cost: 50,
    category: "Environmental",
    icon: <Trees className="w-6 h-6" />,
    available: true,
    popular: true
  },
  {
    id: "2",
    name: "Eco Coffee Mug",
    description: "Sustainable bamboo coffee mug with branding",
    cost: 30,
    category: "Merchandise",
    icon: <Coffee className="w-6 h-6" />,
    available: true,
    popular: false
  },
  {
    id: "3",
    name: "Seed Packet Kit",
    description: "Native wildflower seed packet to plant in your local area",
    cost: 15,
    category: "Environmental",
    icon: <Sprout className="w-6 h-6" />,
    available: true,
    popular: false
  },
  {
    id: "4",
    name: "Carbon Offset 10kg",
    description: "Offset 10kg of CO2 through verified carbon reduction projects",
    cost: 25,
    category: "Environmental",
    icon: <Leaf className="w-6 h-6" />,
    available: true,
    popular: true
  },
  {
    id: "5",
    name: "Eco Tote Bag",
    description: "Organic cotton tote bag perfect for grocery shopping",
    cost: 20,
    category: "Merchandise",
    icon: <ShoppingBag className="w-6 h-6" />,
    available: true,
    popular: false
  },
  {
    id: "6",
    name: "Wildlife Protection",
    description: "Donate to wildlife conservation efforts in your region",
    cost: 40,
    category: "Environmental",
    icon: <Heart className="w-6 h-6" />,
    available: true,
    popular: false
  },
  {
    id: "7",
    name: "Eco Achievement Badge",
    description: "Special digital badge for your developer profile",
    cost: 10,
    category: "Digital",
    icon: <Award className="w-6 h-6" />,
    available: true,
    popular: false
  },
  {
    id: "8",
    name: "Premium Tree",
    description: "Plant a premium native tree species with GPS tracking",
    cost: 100,
    category: "Environmental",
    icon: <Trees className="w-6 h-6" />,
    available: true,
    popular: false
  }
]

const mockRedemptions: Redemption[] = [
  {
    id: "1",
    userId: "user1",
    rewardId: "1",
    rewardName: "Plant a Tree",
    cost: 50,
    date: "2023-10-15"
  }
]

export default function RewardsStore() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [redemptions, setRedemptions] = useState<Redemption[]>(mockRedemptions)
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(user?.eco_credits || 0)

  if (!user) return null

  const handleRedeem = async (reward: Reward) => {
    if (userCredits < reward.cost || !reward.available) return

    setIsRedeeming(reward.id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newRedemption: Redemption = {
      id: Date.now().toString(),
      userId: user.id,
      rewardId: reward.id,
      rewardName: reward.name,
      cost: reward.cost,
      date: new Date().toISOString().split("T")[0],
    }

    setRedemptions([newRedemption, ...redemptions])
    setUserCredits(userCredits - reward.cost)
    setIsRedeeming(null)
    
    // Show success toast
    toast({
      title: "Reward redeemed!",
      description: `You've successfully redeemed ${reward.name} for ${reward.cost} eco-credits.`,
    })
  }

  const environmentalRewards = mockRewards.filter((r) => r.category === "Environmental")
  const merchandiseRewards = mockRewards.filter((r) => r.category === "Merchandise")
  const digitalRewards = mockRewards.filter((r) => r.category === "Digital")

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Environmental":
        return "bg-green-100 text-green-800"
      case "Merchandise":
        return "bg-blue-100 text-blue-800"
      case "Digital":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const canAfford = userCredits >= reward.cost && reward.available
    const isCurrentlyRedeeming = isRedeeming === reward.id

    return (
      <Card
        className={`border-2 transition-all ${canAfford ? "border-green-200 hover:border-green-300" : "border-gray-200 opacity-80"}`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-full bg-green-50 text-green-700">
              {reward.icon}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={`${getCategoryColor(reward.category)} text-xs px-2 py-1`}>
                {reward.category}
              </Badge>
              {reward.popular && (
                <Badge className="bg-amber-100 text-amber-800 text-xs px-2 py-1">Popular</Badge>
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-lg text-green-800 leading-tight">{reward.name}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed">{reward.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Badge
              variant={canAfford ? "default" : "secondary"}
              className={`${canAfford ? "bg-green-100 text-green-800" : ""} text-sm px-3 py-1 w-fit`}
            >
              {reward.cost} credits
            </Badge>
            <Button
              onClick={() => handleRedeem(reward)}
              disabled={!canAfford || isCurrentlyRedeeming}
              className={`${canAfford ? "bg-green-600 hover:bg-green-700" : ""} w-full sm:w-auto text-sm px-4 py-2`}
              variant={canAfford ? "default" : "secondary"}
              size="sm"
            >
              {isCurrentlyRedeeming ? "Processing..." : 
               !reward.available ? "Out of Stock" :
               canAfford ? "Redeem Now" : "Insufficient Credits"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 flex items-center">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
          Rewards Store
        </h1>
        <p className="text-green-600 text-sm sm:text-base">Use your eco-credits to make a positive impact or get eco-friendly products.</p>
      </div>

      {/* Credits Display */}
      <Card className="mb-6 sm:mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-green-800 flex items-center">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                {userCredits} Eco-Credits Available
              </h2>
              <p className="text-green-600 text-sm sm:text-base">Ready to spend on meaningful rewards</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-green-700">Locked Credits</p>
              <p className="text-lg sm:text-xl font-semibold text-orange-600">{user.locked_credits || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="environmental" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="environmental" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
            <TreePine className="h-4 w-4" />
            <span className="hidden sm:inline">Environmental</span>
            <span className="sm:hidden">Eco</span>
          </TabsTrigger>
          <TabsTrigger value="merchandise" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Merchandise</span>
            <span className="sm:hidden">Items</span>
          </TabsTrigger>
          <TabsTrigger value="digital" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Award className="h-4 w-4" />
            <span>Digital</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {environmentalRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="merchandise" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {merchandiseRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="digital" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {digitalRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 sm:space-y-6">
          <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 text-lg sm:text-xl">Redemption History</CardTitle>
              <CardDescription className="text-sm sm:text-base">Your past reward redemptions</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {redemptions.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {redemptions.map((redemption) => (
                    <div key={redemption.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-green-800 text-sm sm:text-base">{redemption.rewardName}</h3>
                          <p className="text-xs sm:text-sm text-green-600">
                            Redeemed on {new Date(redemption.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 w-fit text-xs sm:text-sm">-{redemption.cost} credits</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">No redemptions yet</p>
                  <p className="text-xs sm:text-sm text-gray-500">Start redeeming rewards to see your history here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}