import ModernHeader from '../../components/ModernHeader';
import SEO from '../../components/SEO';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <SEO
        title="Privacy Policy"
        description="Read JnU RedDrop's privacy policy to understand how we collect, use, and protect your personal information."
        url="/privacy-policy"
        noIndex
      />
      <ModernHeader title="Privacy Policy" />
      <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-3xl md:px-8 md:py-12">
        <p className="text-gray-500 text-center py-10">Privacy Policy page is under construction.</p>
      </div>
    </div>
  );
}
