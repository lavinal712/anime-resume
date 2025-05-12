import { View, Image as PDFImage } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location } = profile;
  const iconProps = { email, phone, location, url };

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <View style={{ ...styles.flexRow, gap: spacing["4"] }}>
        {/* Avatar on the left */}
        <View style={{ width: 100 }}>
          {isPDF ? (
            <PDFImage src="/mygo/anon.jpg" style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <img 
              src="/mygo/anon.jpg" 
              alt="Profile" 
              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} 
            />
          )}
        </View>
        
        {/* Profile information on the right */}
        <View style={{ flex: 1 }}>
          <ResumePDFText
            bold={true}
            themeColor={themeColor}
            style={{ fontSize: "20pt" }}
          >
            {name}
          </ResumePDFText>
          <View style={{ marginTop: spacing["0.5"] }}>
            {summary && <ResumePDFText>{summary}</ResumePDFText>}
          </View>
          <View
            style={{
              ...styles.flexRowBetween,
              flexWrap: "wrap",
              marginTop: spacing["1"],
            }}
          >
            {Object.entries(iconProps).map(([key, value]) => {
              if (!value) return null;

              let iconType = key as IconType;
              if (key === "url") {
                if (value.includes("github")) {
                  iconType = "url_github";
                } else if (value.includes("linkedin")) {
                  iconType = "url_linkedin";
                }
              }

              const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
              const Wrapper = ({ children }: { children: React.ReactNode }) => {
                if (!shouldUseLinkWrapper) return <>{children}</>;

                let src = "";
                switch (key) {
                  case "email": {
                    src = `mailto:${value}`;
                    break;
                  }
                  case "phone": {
                    src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                    break;
                  }
                  default: {
                    src = value.startsWith("http") ? value : `https://${value}`;
                  }
                }

                return (
                  <ResumePDFLink src={src} isPDF={isPDF}>
                    {children}
                  </ResumePDFLink>
                );
              };

              return (
                <View
                  key={key}
                  style={{
                    ...styles.flexRow,
                    alignItems: "center",
                    gap: spacing["1"],
                  }}
                >
                  <ResumePDFIcon type={iconType} isPDF={isPDF} />
                  <Wrapper>
                    <ResumePDFText>{value}</ResumePDFText>
                  </Wrapper>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ResumePDFSection>
  );
};
