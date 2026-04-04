'use client';

import { useState } from 'react';
import Link from "next/link";
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { blogPosts } from '@/data/blogPosts';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <SEOHead
        title="IJMB Blog – Latest News, Admission Updates & Guides"
        description="Stay updated with the latest IJMB news, admission guides, direct entry tips, and university requirements. Your #1 resource for IJMB information."
        canonical="https://www.ijmb.info/blog"
        keywords="IJMB news, IJMB updates, direct entry admission, IJMB guide, university admission, Nigeria education blog"
      />

      <div className="min-h-screen bg-muted/20 pb-20">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">IJMB Blog & Updates</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Expert guides, admission news, and educational resources to help you secure 200-level admission.
            </p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-background rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow flex flex-col h-full">
                  <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="group">
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User size={14} /> {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button asChild variant="ghost" className="w-full mt-4 justify-between group">
                      <Link href={`/blog/${post.slug}`}>
                        Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
              <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Blog;
