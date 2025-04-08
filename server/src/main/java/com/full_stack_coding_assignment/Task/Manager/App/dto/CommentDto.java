package com.full_stack_coding_assignment.Task.Manager.App.dto;

import lombok.Data;
import java.util.Date;

@Data
public class CommentDto {

    private Long id;

    private String content;

    private Date createdAt;

    private Long taskId;

    private Long userId;

    private String postedBy;

    private String profileImage;
}
