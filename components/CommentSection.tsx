
import React, { useState, useEffect, useCallback } from 'react';
import { type Comment } from '../types';
import { getComments, postComment } from '../services/wordpressService';
import LoadingSpinner from './LoadingSpinner';

interface CommentSectionProps {
  articleId: number;
}

type CommentWithReplies = Comment & { replies: CommentWithReplies[] };

const ReplyForm: React.FC<{ onSubmit: (author: string, text: string) => void; onCancel: () => void; isSubmitting: boolean }> = ({ onSubmit, onCancel, isSubmitting }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Name and comment are required.');
      return;
    }
    onSubmit(author, text);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 ml-6 pl-6 border-l-2 border-gray-200">
       <div className="grid grid-cols-1 gap-y-4">
        <div>
          <label htmlFor={`reply-author-${Math.random()}`} className="sr-only">Name</label>
          <input type="text" name="author" id={`reply-author-${Math.random()}`} value={author} onChange={(e) => setAuthor(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border" placeholder="Your Name"
          />
        </div>
        <div>
          <label htmlFor={`reply-comment-${Math.random()}`} className="sr-only">Comment</label>
          <textarea name="comment" id={`reply-comment-${Math.random()}`} rows={3} value={text} onChange={(e) => setText(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border" placeholder="Write a reply..."
          ></textarea>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <div className="mt-4 flex items-center space-x-2">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-blue-900">
          {isSubmitting ? <LoadingSpinner/> : 'Submit Reply'}
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
      </div>
    </form>
  )
}

const CommentThread: React.FC<{ comment: CommentWithReplies; onReplySubmit: (author: string, text: string, parentId: number) => void; activeReplyId: number | null; setActiveReplyId: (id: number | null) => void; isSubmitting: boolean, depth?: number }> = ({ comment, onReplySubmit, activeReplyId, setActiveReplyId, isSubmitting, depth = 0 }) => {
  const isReplying = activeReplyId === comment.id;

  return (
    <div className="relative">
      {depth > 0 && <div className="absolute top-0 -left-1 w-6 h-full"><div className="w-full h-full border-l-2 border-b-2 border-gray-200 rounded-bl-lg"></div></div>}
      <div className="p-4 bg-light-bg border border-gray-200 rounded-md">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-bold text-text-primary">{comment.author_name}</p>
          <time dateTime={comment.date} className="text-xs text-text-secondary">
            {new Date(comment.date).toLocaleString()}
          </time>
        </div>
        <div className="mt-2 text-text-secondary" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
        <button onClick={() => setActiveReplyId(isReplying ? null : comment.id)} className="mt-2 text-xs font-bold text-brand-blue hover:underline">
            {isReplying ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {isReplying && <ReplyForm onSubmit={(author, text) => onReplySubmit(author, text, comment.id)} onCancel={() => setActiveReplyId(null)} isSubmitting={isSubmitting} />}
      
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4 pl-6">
          {comment.replies.map(reply => (
            <CommentThread key={reply.id} comment={reply} onReplySubmit={onReplySubmit} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} isSubmitting={isSubmitting} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(articleId);
      setComments(fetchedComments);
    } catch (e) {
      setError("Could not load comments.");
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (author: string, text: string, parentId: number = 0) => {
    setIsSubmitting(true);
    setError('');
    try {
      await postComment(articleId, author, text, parentId);
      // Refetch comments to show the new one
      await fetchComments();
      setActiveReplyId(null);
    } catch (e) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Name and comment cannot be empty.');
      return;
    }
    handleCommentSubmit(author, text);
    setAuthor('');
    setText('');
  };
  
  const buildCommentTree = useCallback((commentList: Comment[], parentId: number = 0): CommentWithReplies[] => {
    return commentList
      .filter(comment => comment.parent === parentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(comment => ({
        ...comment,
        replies: buildCommentTree(commentList, comment.id),
      }));
  }, []);

  const commentTree = buildCommentTree(comments);

  return (
    <section className="mt-12" aria-labelledby="comments-heading">
      <div className="bg-light-surface p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 id="comments-heading" className="text-2xl font-bold text-text-primary mb-6 border-b-2 border-brand-blue pb-2">Discussion</h2>

        <form onSubmit={handleTopLevelSubmit} className="mb-8">
           <h3 className="text-lg font-medium text-text-primary mb-4">Leave a Comment</h3>
          <div className="grid grid-cols-1 gap-y-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-text-primary">Name</label>
              <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-text-primary">Comment</label>
              <textarea id="comment" name="comment" rows={4} value={text} onChange={(e) => setText(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm p-2 border" placeholder="Share your thoughts..."></textarea>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="mt-6">
            <button type="submit" disabled={isSubmitting} className="inline-flex justify-center items-center rounded-md border border-transparent bg-brand-blue py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:bg-blue-900">
             {isSubmitting && !activeReplyId ? <><LoadingSpinner/> <span className="ml-2">Posting...</span></> : 'Post Comment'}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading ? <p>Loading comments...</p> : commentTree.length > 0 ? (
            commentTree.map((comment) => (
              <CommentThread key={comment.id} comment={comment} onReplySubmit={handleCommentSubmit} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} isSubmitting={isSubmitting && activeReplyId === comment.id}/>
            ))
          ) : (
            <p className="text-text-secondary">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
