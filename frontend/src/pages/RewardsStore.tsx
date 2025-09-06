// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Gift, 
//   Leaf, 
//   Trees,
//   Sprout,
//   Award,
//   Coffee,
//   ShoppingBag,
//   Heart
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const RewardsStore = () => {
//   const { toast } = useToast();

//   const handleRedeem = (rewardName: string, cost: number) => {
//     toast({
//       title: "Reward redeemed!",
//       description: `You've redeemed ${rewardName} for ${cost} eco-credits`,
//     });
//   };

//   const rewards = [
//     {
//       id: 1,
//       name: "Plant a Tree",
//       description: "We'll plant a real tree in your name in a reforestation project",
//       cost: 50,
//       category: "Environmental",
//       icon: <Trees className="w-6 h-6" />,
//       available: true,
//       popular: true
//     },
//     {
//       id: 2,
//       name: "Eco Coffee Mug",
//       description: "Sustainable bamboo coffee mug with Code-to-Nature branding",
//       cost: 30,
//       category: "Merchandise",
//       icon: <Coffee className="w-6 h-6" />,
//       available: true,
//       popular: false
//     },
//     {
//       id: 3,
//       name: "Seed Packet Kit",
//       description: "Native wildflower seed packet to plant in your local area",
//       cost: 15,
//       category: "Environmental",
//       icon: <Sprout className="w-6 h-6" />,
//       available: true,
//       popular: false
//     },
//     {
//       id: 4,
//       name: "Carbon Offset 10kg",
//       description: "Offset 10kg of CO2 through verified carbon reduction projects",
//       cost: 25,
//       category: "Environmental",
//       icon: <Leaf className="w-6 h-6" />,
//       available: true,
//       popular: true
//     },
//     {
//       id: 5,
//       name: "Eco Tote Bag",
//       description: "Organic cotton tote bag perfect for grocery shopping",
//       cost: 20,
//       category: "Merchandise",
//       icon: <ShoppingBag className="w-6 h-6" />,
//       available: true,
//       popular: false
//     },
//     {
//       id: 6,
//       name: "Wildlife Protection",
//       description: "Donate to wildlife conservation efforts in your region",
//       cost: 40,
//       category: "Environmental",
//       icon: <Heart className="w-6 h-6" />,
//       available: false,
//       popular: false
//     },
//     {
//       id: 7,
//       name: "Eco Achievement Badge",
//       description: "Special digital badge for your developer profile",
//       cost: 10,
//       category: "Digital",
//       icon: <Award className="w-6 h-6" />,
//       available: true,
//       popular: false
//     },
//     {
//       id: 8,
//       name: "Premium Tree",
//       description: "Plant a premium native tree species with GPS tracking",
//       cost: 100,
//       category: "Environmental",
//       icon: <Trees className="w-6 h-6" />,
//       available: true,
//       popular: false
//     }
//   ];

//   const userCredits = 247; // This would come from user state

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case "Environmental":
//         return "bg-success/20 text-success";
//       case "Merchandise":
//         return "bg-primary/20 text-primary";
//       case "Digital":
//         return "bg-accent/20 text-accent";
//       default:
//         return "bg-muted/20 text-muted-foreground";
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-warning to-accent rounded-lg flex items-center justify-center">
//             <Gift className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">Rewards Store</h1>
//             <p className="text-muted-foreground">Redeem your eco-credits for sustainable rewards</p>
//           </div>
//         </div>
        
//         <Card className="bg-gradient-to-r from-primary to-success text-white">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <Leaf className="w-5 h-5" />
//               <div>
//                 <p className="text-sm opacity-90">Your Credits</p>
//                 <p className="text-2xl font-bold">{userCredits}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {rewards.map((reward) => (
//           <Card 
//             key={reward.id} 
//             className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
//               !reward.available ? 'opacity-60' : 'hover:-translate-y-1'
//             }`}
//           >
//             {reward.popular && (
//               <div className="absolute top-2 right-2 z-10">
//                 <Badge className="bg-warning text-warning-foreground">
//                   Popular
//                 </Badge>
//               </div>
//             )}
            
//             <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />
            
//             <CardHeader className="relative">
//               <div className="flex items-start justify-between">
//                 <div className="text-primary">
//                   {reward.icon}
//                 </div>
//                 <Badge className={getCategoryColor(reward.category)}>
//                   {reward.category}
//                 </Badge>
//               </div>
//               <CardTitle className="text-lg">{reward.name}</CardTitle>
//               <CardDescription className="text-sm">
//                 {reward.description}
//               </CardDescription>
//             </CardHeader>
            
//             <CardFooter className="relative pt-0">
//               <div className="w-full">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2">
//                     <Leaf className="w-4 h-4 text-primary" />
//                     <span className="text-xl font-bold text-primary">
//                       {reward.cost}
//                     </span>
//                     <span className="text-sm text-muted-foreground">credits</span>
//                   </div>
//                 </div>
                
//                 <Button 
//                   onClick={() => handleRedeem(reward.name, reward.cost)}
//                   disabled={!reward.available || userCredits < reward.cost}
//                   className="w-full"
//                   variant={userCredits >= reward.cost && reward.available ? "default" : "secondary"}
//                 >
//                   {!reward.available ? "Coming Soon" : 
//                    userCredits < reward.cost ? "Insufficient Credits" : 
//                    "Redeem"}
//                 </Button>
//               </div>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>

//       {/* Redemption History */}
//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Recent Redemptions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {[
//               { item: "Plant a Tree", date: "Jan 10, 2024", credits: -50 },
//               { item: "Eco Coffee Mug", date: "Jan 5, 2024", credits: -30 },
//               { item: "Seed Packet Kit", date: "Dec 28, 2023", credits: -15 },
//             ].map((redemption, idx) => (
//               <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
//                 <div>
//                   <p className="font-medium">{redemption.item}</p>
//                   <p className="text-sm text-muted-foreground">{redemption.date}</p>
//                 </div>
//                 <div className="text-destructive font-semibold">
//                   {redemption.credits} credits
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default RewardsStore;

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
  const [userCredits, setUserCredits] = useState(user?.ecoCredits || 0)

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
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-full bg-green-50 text-green-700">
              {reward.icon}
            </div>
            <div className="flex flex-col items-end">
              <Badge className={getCategoryColor(reward.category)}>
                {reward.category}
              </Badge>
              {reward.popular && (
                <Badge className="mt-1 bg-amber-100 text-amber-800">Popular</Badge>
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-lg text-green-800">{reward.name}</CardTitle>
            <CardDescription className="mt-2">{reward.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Badge
            variant={canAfford ? "default" : "secondary"}
            className={canAfford ? "bg-green-100 text-green-800" : ""}
          >
            {reward.cost} credits
          </Badge>
          <Button
            onClick={() => handleRedeem(reward)}
            disabled={!canAfford || isCurrentlyRedeeming}
            className={`${canAfford ? "bg-green-600 hover:bg-green-700" : ""}`}
            variant={canAfford ? "default" : "secondary"}
          >
            {isCurrentlyRedeeming ? "Processing..." : 
             !reward.available ? "Out of Stock" :
             canAfford ? "Redeem Now" : "Insufficient Credits"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center">
          <Gift className="h-8 w-8 mr-3" />
          Rewards Store
        </h1>
        <p className="text-green-600">Use your eco-credits to make a positive impact or get eco-friendly products.</p>
      </div>

      {/* Credits Display */}
      <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-800 flex items-center">
                <Coins className="h-6 w-6 mr-2" />
                {userCredits} Eco-Credits Available
              </h2>
              <p className="text-green-600">Ready to spend on meaningful rewards</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700">Locked Credits</p>
              <p className="text-xl font-semibold text-orange-600">{user.lockedCredits || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="environmental" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="environmental" className="flex items-center space-x-2">
            <TreePine className="h-4 w-4" />
            <span>Environmental</span>
          </TabsTrigger>
          <TabsTrigger value="merchandise" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Merchandise</span>
          </TabsTrigger>
          <TabsTrigger value="digital" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Digital</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environmentalRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="merchandise" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchandiseRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="digital" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Redemption History</CardTitle>
              <CardDescription>Your past reward redemptions</CardDescription>
            </CardHeader>
            <CardContent>
              {redemptions.length > 0 ? (
                <div className="space-y-4">
                  {redemptions.map((redemption) => (
                    <div key={redemption.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-medium text-green-800">{redemption.rewardName}</h3>
                          <p className="text-sm text-green-600">
                            Redeemed on {new Date(redemption.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">-{redemption.cost} credits</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No redemptions yet</p>
                  <p className="text-sm text-gray-500">Start redeeming rewards to see your history here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}