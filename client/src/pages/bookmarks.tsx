import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bookmark, Search, Edit, Trash2, Download, ExternalLink } from "lucide-react";
import type { Bookmark as BookmarkType, Search as SearchType } from "@shared/schema";

interface BookmarkWithSearch extends BookmarkType {
  search?: SearchType;
}

export default function Bookmarks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useState("");
  const [editingBookmark, setEditingBookmark] = useState<BookmarkType | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const { data: bookmarks, isLoading } = useQuery<BookmarkType[]>({
    queryKey: ["/api/bookmarks"],
  });

  const { data: searches } = useQuery<SearchType[]>({
    queryKey: ["/api/searches"],
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      await apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Bookmark deleted",
        description: "Bookmark has been removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete",
        description: error.message || "Failed to delete bookmark",
        variant: "destructive",
      });
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; notes?: string }) => {
      const response = await apiRequest("PATCH", `/api/bookmarks/${data.id}`, {
        title: data.title,
        notes: data.notes,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      setEditingBookmark(null);
      setEditTitle("");
      setEditNotes("");
      toast({
        title: "Bookmark updated",
        description: "Bookmark has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update",
        description: error.message || "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (bookmark: BookmarkType) => {
    setEditingBookmark(bookmark);
    setEditTitle(bookmark.title);
    setEditNotes(bookmark.notes || "");
  };

  const handleSaveEdit = () => {
    if (!editingBookmark || !editTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the bookmark",
        variant: "destructive",
      });
      return;
    }

    updateBookmarkMutation.mutate({
      id: editingBookmark.id,
      title: editTitle,
      notes: editNotes || undefined,
    });
  };

  const handleExportBookmarks = () => {
    if (!bookmarks || bookmarks.length === 0) {
      toast({
        title: "No bookmarks to export",
        description: "You don't have any bookmarks yet",
        variant: "destructive",
      });
      return;
    }

    const bookmarksWithSearchData = bookmarks.map(bookmark => {
      const search = searches?.find(s => s.id === bookmark.searchId);
      return {
        title: bookmark.title,
        notes: bookmark.notes,
        createdAt: bookmark.createdAt,
        search: search ? {
          query: search.query,
          searchType: search.searchType,
          status: search.status,
          createdAt: search.createdAt,
        } : null,
      };
    });

    const exportData = {
      exportDate: new Date().toISOString(),
      totalBookmarks: bookmarks.length,
      bookmarks: bookmarksWithSearchData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Bookmarks have been exported successfully",
    });
  };

  // Combine bookmarks with search data
  const bookmarksWithSearches: BookmarkWithSearch[] = bookmarks?.map(bookmark => ({
    ...bookmark,
    search: searches?.find(search => search.id === bookmark.searchId),
  })) || [];

  const filteredBookmarks = bookmarksWithSearches.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    bookmark.notes?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    bookmark.search?.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-800">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-auto bg-gray-800 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-50 mb-2" data-testid="page-title">
                  Bookmarks
                </h1>
                <p className="text-gray-400" data-testid="page-description">
                  Manage your saved OSINT investigations and findings
                </p>
              </div>
              <Button
                onClick={handleExportBookmarks}
                className="osint-button-primary"
                data-testid="button-export-bookmarks"
              >
                <Download className="mr-2" size={16} />
                Export Bookmarks
              </Button>
            </div>

            {/* Search Filter */}
            <div className="osint-card p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="osint-search-input pl-10"
                  data-testid="input-search-bookmarks"
                />
              </div>
            </div>

            {/* Bookmarks List */}
            <div className="osint-card">
              {isLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-800 rounded-lg animate-pulse">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="h-5 bg-gray-600 rounded w-64 mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-600 rounded w-48"></div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-gray-600 rounded"></div>
                            <div className="w-8 h-8 bg-gray-600 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-50 mb-2" data-testid="no-bookmarks-title">
                    No bookmarks found
                  </h3>
                  <p className="text-gray-400" data-testid="no-bookmarks-description">
                    {searchFilter 
                      ? "No bookmarks match your search" 
                      : "Save important searches to access them quickly"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredBookmarks.map((bookmark) => (
                    <div 
                      key={bookmark.id} 
                      className="p-6 hover:bg-gray-800 transition-colors"
                      data-testid={`bookmark-item-${bookmark.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-50" data-testid={`bookmark-title-${bookmark.id}`}>
                              {bookmark.title}
                            </h3>
                            {bookmark.search && (
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                                {bookmark.search.searchType.toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          {bookmark.search && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-gray-400">Query:</span>
                              <span className="text-sm text-gray-50 font-mono" data-testid={`bookmark-query-${bookmark.id}`}>
                                {bookmark.search.query}
                              </span>
                            </div>
                          )}
                          
                          {bookmark.notes && (
                            <p className="text-gray-300 text-sm mb-3" data-testid={`bookmark-notes-${bookmark.id}`}>
                              {bookmark.notes}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-400" data-testid={`bookmark-date-${bookmark.id}`}>
                            Bookmarked {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {bookmark.search?.results && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
                              data-testid={`button-view-search-${bookmark.id}`}
                            >
                              <ExternalLink size={16} className="mr-1" />
                              View Search
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(bookmark)}
                                className="text-gray-400 hover:text-gray-200"
                                data-testid={`button-edit-${bookmark.id}`}
                              >
                                <Edit size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border-gray-600">
                              <DialogHeader>
                                <DialogTitle className="text-gray-50">Edit Bookmark</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title
                                  </label>
                                  <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="osint-search-input"
                                    data-testid="input-edit-title"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Notes
                                  </label>
                                  <Textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className="osint-search-input"
                                    rows={4}
                                    data-testid="textarea-edit-notes"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingBookmark(null)}
                                    className="osint-button-secondary"
                                    data-testid="button-cancel-edit"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleSaveEdit}
                                    disabled={updateBookmarkMutation.isPending}
                                    className="osint-button-primary"
                                    data-testid="button-save-edit"
                                  >
                                    {updateBookmarkMutation.isPending ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBookmarkMutation.mutate(bookmark.id)}
                            disabled={deleteBookmarkMutation.isPending}
                            className="text-red-400 hover:text-red-300"
                            data-testid={`button-delete-${bookmark.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {filteredBookmarks.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm" data-testid="bookmarks-summary">
                  Showing {filteredBookmarks.length} of {bookmarks?.length || 0} total bookmarks
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
