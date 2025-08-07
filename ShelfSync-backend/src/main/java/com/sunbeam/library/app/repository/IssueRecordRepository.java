package com.sunbeam.library.app.repository;

import com.sunbeam.library.app.entity.BookCopy;
import com.sunbeam.library.app.entity.IssueRecord;
import com.sunbeam.library.app.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {
    Optional<IssueRecord> findByBookCopyAndReturnDateIsNull(BookCopy bookCopy);
    List<IssueRecord> findByDueDateBeforeAndReturnDateIsNull(LocalDate date);
    List<IssueRecord> findByMemberOrderByIssueDateDesc(Member member);
    List<IssueRecord> findByMemberAndReturnDateIsNull(Member member);
}   