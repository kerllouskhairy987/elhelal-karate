import { Card, CardContent } from "@/components/ui/card";
import React from "react";

// مكون بطاقة المعلومات
const InfoCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string;
  subtitle?: string;
}) => (
  <Card className="text-center hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
    <CardContent className="p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1 ">{title}</p>
          <p className="text-xl font-bold text-foreground break-all">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default InfoCard;
