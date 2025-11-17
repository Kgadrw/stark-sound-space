import { HeroEditor } from "@/components/admin/AdminDashboard";
import { useContent } from "@/context/ContentContext";

const HeroAdmin = () => {
  const { content, setContent, refreshContent } = useContent();

  return (
    <section className="space-y-6 rounded-lg border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
      <div>
        <p className="text-sm text-white/50 mb-1">Hero Section</p>
        <h2 className="text-2xl font-semibold text-white">Landing Content</h2>
      </div>
      <HeroEditor content={content} setContent={setContent} refreshContent={refreshContent} />
    </section>
  );
};

export default HeroAdmin;


