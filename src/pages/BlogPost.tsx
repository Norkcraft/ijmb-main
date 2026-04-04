'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Tag, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { blogPosts } from '@/data/blogPosts';
import NotFound from '@/pages/NotFound';
import { toast } from 'sonner';

const BlogPost = ({ slug: slugProp }: { slug?: string }) => {
  const params = useParams();
  const slug = slugProp || (params?.slug as string);
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  // Schema Markup for Article
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author,
      "url": "https://www.ijmb.info"
    }]
  };

  // Related posts (simple implementation: same tags)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <>
      <SEOHead
        title={`${post.title} – IJMB Blog`}
        description={post.excerpt}
        canonical={`https://www.ijmb.info/blog/${post.slug}`}
        keywords={post.tags.join(', ')}
        schema={schema}
      />

      <div className="min-h-screen bg-background pb-20">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover absolute inset-0 z-0"
          />
          <div className="relative z-20 max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-12 text-white">
            <Link href="/blog" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Badge key={tag} className="bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-shadow-lg">
              {post.title}
            </h1>
            <div className="flex items-center flex-wrap gap-6 text-sm md:text-base opacity-90">
              <span className="flex items-center gap-2">
                <User size={18} /> {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} /> {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} /> {Math.ceil(post.content.length / 1000)} min read
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <article className="prose prose-lg prose-blue max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t flex items-center justify-between">
              <h3 className="font-semibold text-lg">Share this article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 size={16} className="mr-2" /> Share
                </Button>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* CTA Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-2 text-primary">Ready to Apply?</h3>
              <p className="text-muted-foreground mb-4">
                Join thousands of students securing 200-level admission into Nigerian universities through IJMB.
              </p>
              <Button asChild className="w-full cta-gradient font-bold text-lg h-12">
                <Link href="/ijmb-registration">Register Now</Link>
              </Button>
              <p className="text-xs text-center mt-3 text-muted-foreground">
                Registration for 2024/2025 session is ongoing.
              </p>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Tag size={18} /> Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="block group">
                      <div className="flex gap-4 items-start">
                        <img
                          src={rp.image}
                          alt={rp.title}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0 group-hover:opacity-80 transition-opacity"
                        />
                        <div>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {rp.title}
                          </h4>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {new Date(rp.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
