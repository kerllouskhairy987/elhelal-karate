import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentType } from "@/utils/viewPlayer";
import { Download, Eye, FileText } from "lucide-react";

const DocumentCard = ({ document }: { document: { url: string } }) => {
  const documentType = getDocumentType(document.url);
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm text-foreground truncate">
                {documentType}
              </p>
              <Badge variant="outline" className="text-xs">
                {document.url.split('.').pop()?.toUpperCase()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1 flex-1"
                asChild
              >
                <a href={document.url} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3 h-3" />
                  معاينة
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1 flex-1"
                asChild
              >
                <a href={document.url} download>
                  <Download className="w-3 h-3" />
                  تحميل
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;