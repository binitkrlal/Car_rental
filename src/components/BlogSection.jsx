import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '../data/cars';
import './BlogSection.css';

const BlogSection = () => (
  <section className="section blog">
    <div className="container">
      <motion.div className="blog__header"
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.8 }}>
        <h2 className="blog__title">Insights & Stories</h2>
        <p>Stay informed with the latest from the world of driving.</p>
      </motion.div>
      <div className="blog__grid">
        {blogPosts.map((post, i) => (
          <motion.article key={post.id} className="blog__card glass-panel"
            initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.7 }}>
            <div className="blog__card-top">
              <span className="blog__cat">{post.category}</span>
              <span className="blog__date">{post.date}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="blog__card-footer">
              <span><Clock size={14} /> {post.readTime}</span>
              <button className="btn-ghost">Read More <ArrowRight size={14} /></button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection;
