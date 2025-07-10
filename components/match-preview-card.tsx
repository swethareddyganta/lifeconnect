import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const Tiers = [
  {
    name: "Friend",
    users: "Close Match",
    avatar: "https://i.pravatar.cc/150?u=jane_doe",
    initials: "JD",
    features: ["Northwood High School", "2004 - 2008", "Drama club member"],
    highlighted: false,
  },
  {
    name: "Colleague",
    users: "Strong Match",
    avatar: "https://i.pravatar.cc/150?u=david_liu",
    initials: "DL",
    features: ["Acme Inc.", "2010 - 2018", "Marketing department", "Springfield, IL"],
    highlighted: true,
  },
  {
    name: "Acquaintance",
    users: "Possible Match",
    avatar: "https://i.pravatar.cc/150?u=john_smith",
    initials: "JS",
    features: ["Lived on Oak Street", "Springfield, IL"],
    highlighted: false,
  },
]

export function MatchPreviewCard() {
  return (
    <Card className="w-full max-w-4xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
      <CardHeader className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">LifeConnect AI</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>Matches</span>
            <span>Timeline</span>
            <span>Profile</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-4 transition-all ${
                tier.highlighted
                  ? "border-2 border-lime-400 bg-slate-50 dark:bg-slate-800/50 shadow-md"
                  : "border border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{tier.name}</h3>
                {tier.highlighted && (
                  <Badge
                    variant="outline"
                    className="bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/50 dark:text-lime-300 dark:border-lime-700"
                  >
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tier.users}</p>

              <div className="my-6 flex items-center justify-center">
                <Avatar className="h-20 w-20 text-4xl border-2 border-white dark:border-slate-800 shadow-lg">
                  <AvatarImage src={tier.avatar || "/placeholder.svg"} alt={tier.name} />
                  <AvatarFallback>{tier.initials}</AvatarFallback>
                </Avatar>
              </div>

              <Button
                className={`w-full ${
                  tier.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                }`}
              >
                Connect
              </Button>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Shared connections:</p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5 text-lime-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
