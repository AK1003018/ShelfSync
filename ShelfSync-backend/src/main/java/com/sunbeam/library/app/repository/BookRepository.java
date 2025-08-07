package com.sunbeam.library.app.repository;

import com.sunbeam.library.app.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "b.isbn LIKE CONCAT('%', :query, '%')")
    List<Book> searchBooks(@Param("query") String query);
}