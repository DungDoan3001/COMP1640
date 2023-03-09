﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Web.Api.DTOs.ResponseModels;
using Web.Api.Services.Chart;

namespace Web.Api.Controllers
{
    [Route("api/charts")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        public readonly IChartService _chartService;
        public ChartController(IChartService chartService)
        {
            _chartService = chartService;
        }
        /// <summary>
        /// Get all needed information for Contributors Chart.
        /// </summary>
        /// <response code="200">Successfully get all information</response>
        /// <response code="400">There is something wrong while execute.</response>
        [HttpGet("ContributorsByDepart")]
        public async Task<ActionResult<List<ContributorResponseModel>>> GetContributorsByDepart() 
        {
            try
            {
                return await _chartService.GetContributorByDepart();
            }
            catch (Exception ex)
            {

                return BadRequest(new MessageResponseModel
                {
                    Message = "Error",
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Errors = new List<string> { ex.GetBaseException().Message }
                });
            }
        }

        /// <summary>
        /// Total Idea count for each department.
        /// </summary>
        /// <response code="200">Successfully get all information</response>
        /// <response code="400">There is something wrong while execute.</response>
        [HttpGet("ideas-by-department")]
        public async Task<ActionResult<List<TotalIdeaOfDepartmentsResponseModel>>> GetTotalIdeaByDepartment()
        {
            try
            {
                return await _chartService.GetTotalIdeaOfEachDepartment();
            }
            catch (Exception ex)
            {

                return BadRequest(new MessageResponseModel
                {
                    Message = "Error",
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Errors = new List<string> { ex.GetBaseException().Message }
                });
            }
        }

        /// <summary>
        /// Get List of Ideas for dashboard.
        /// </summary>
        /// <response code="200">Successfully get all information</response>
        /// <response code="400">There is something wrong while execute.</response>
        [HttpGet("list-of-ideas")]
        public async Task<ActionResult<List<IdeaForChartResponseModel>>> GetIdeasForChart()
        {
            try
            {
                return await _chartService.GetIdeasForChart();
            }
            catch (Exception ex)
            {

                return BadRequest(new MessageResponseModel
                {
                    Message = "Error",
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Errors = new List<string> { ex.GetBaseException().Message }
                });
            }
        }

        /// <summary>
        /// Percentage Idea count for each department.
        /// </summary>
        /// <response code="200">Successfully get all information</response>
        /// <response code="400">There is something wrong while execute.</response>
        [HttpGet("percentage-of-ideas-by-department")]
        public async Task<ActionResult<List<PercentageOfIdeaForEachDepartment>>> GetPercentageOfIdeasByDepartment()
        {
            try
            {
                return await _chartService.GetPercentageOfIdeaForEachDepartments();
            }
            catch (Exception ex)
            {

                return BadRequest(new MessageResponseModel
                {
                    Message = "Error",
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Errors = new List<string> { ex.GetBaseException().Message }
                });
            }
        }

        /// <summary>
        /// Total staff and idea and comment and topic count.
        /// </summary>
        /// <response code="200">Successfully get all information</response>
        /// <response code="400">There is something wrong while execute.</response>
        [HttpGet("get-staff-idea-comment-topic")]
        public async Task<ActionResult<TotalStaffAndIdeaAndTopicAndCommentResponseModel>> GetTotalStaffAndIdeaAndCommentAndTopic()
        {
            try
            {
                return await _chartService.GetTotalOfStaffAndIdeaAndTopicAndCommment();
            }
            catch (Exception ex)
            {

                return BadRequest(new MessageResponseModel
                {
                    Message = "Error",
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Errors = new List<string> { ex.GetBaseException().Message }
                });
            }
        }

        [HttpGet("NumOfIdeaAnonyByDepartment")]
        public async Task<ActionResult<List<NumOfIdeaAnonyByDepartment>>> GetNumOfIdeaAnonyAndNoCommentByDepart()
        {
            return await _chartService.GetNumOfIdeaAnonyAndNoCommentByDepart();
        }

        [HttpGet("NumOfCommentByDepartment")]
        public async Task<ActionResult<List<NumOfCommentResponseModel>>> GetNumOfCommentByDepart()
        {
            return await _chartService.GetNumOfCommentByDepart();
        }
    }
}
