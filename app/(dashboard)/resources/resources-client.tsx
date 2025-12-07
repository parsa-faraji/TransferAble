"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  DollarSign, 
  GraduationCap, 
  Home, 
  Users, 
  FileText,
  ExternalLink,
  Search
} from "lucide-react";
import { UniversityImage } from "@/components/ui/university-image";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  category?: string;
  tags: string[];
}

export function ResourcesClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === "all" || resource.type === filter;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "SCHOLARSHIP":
        return <DollarSign className="h-5 w-5" />;
      case "ARTICLE":
        return <FileText className="h-5 w-5" />;
      case "VIDEO":
        return <BookOpen className="h-5 w-5" />;
      case "GUIDE":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading resources...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Hub</h1>
        <p className="text-gray-600">
          Scholarships, transfer stories, campus comparisons, and student advice
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="SCHOLARSHIP">Scholarships</option>
          <option value="ARTICLE">Articles</option>
          <option value="VIDEO">Videos</option>
          <option value="GUIDE">Guides</option>
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources found. Check back soon!</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(resource.type)}
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {resource.title}
                    </CardTitle>
                  </div>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {resource.description && (
                  <CardDescription>{resource.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {resource.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full mb-2">
                    {resource.category}
                  </span>
                )}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
