﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading.Tasks;
using Web.Api.Data.Repository;
using Web.Api.Data.UnitOfWork;
using Web.Api.DTOs.ResponseModels;
using Web.Api.Entities;
using static System.Collections.Specialized.BitVector32;

namespace Web.Api.Services.ReactionService
{
    public class ReactionService : IReactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Reaction> _reactionRepo;
        private readonly UserManager<Entities.User> _userManager;
        private readonly IMapper _mapper;

        public ReactionService(IUnitOfWork unitOfWork, UserManager<Entities.User> userManager, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _reactionRepo = unitOfWork.GetBaseRepo<Reaction>();
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<Reaction> Reaction(string username, Guid ideaId, string reactionType)
        {
            try
            {
                var react = new Reaction();
                if (reactionType.Trim().ToLower() == "upvote")
                {
                    react = await CheckReact(1, ideaId, username);
                    return react;
                }
                else if (reactionType.Trim().ToLower() == "downvote")
                {
                    react = await CheckReact(-1, ideaId, username);
                    return react;
                }
                throw new Exception("Reaction type is wrong!");
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<GetUserReactionResponseModel> GetReactionOfUserInIdea(string username, Guid ideaId)
        {
            try
            {
                var findReaction = await _reactionRepo.Find(x => x.User.UserName == username && x.IdeaId == ideaId);
                if (!findReaction.Any())
                {
                    return null;
                }
                var result = _mapper.Map<GetUserReactionResponseModel>(findReaction.First());
                result.Username = username;
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
            

        private async Task<Reaction> CheckReact(int react, Guid ideaId, string username)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(username);
                if (user == null)
                {
                    throw new Exception("Can not find the user");
                }
                var userReact = await _reactionRepo.Find(x => x.IdeaId == ideaId && x.UserId == user.Id);
                if (!userReact.Any())
                {
                    var result = _reactionRepo.Add(new Reaction
                    {
                        UserId = user.Id,
                        IdeaId = ideaId,
                        React = react
                    });
                    await _unitOfWork.CompleteAsync();
                    return result;
                }
                if (userReact.First().React == react || react != 1 && react != -1)
                {
                    var result = _reactionRepo.Delete(userReact.First().Id);
                    await _unitOfWork.CompleteAsync();
                    if (!result)
                    {
                        throw new Exception("Something wrong while deleting reaction");
                    }
                    return null;
                }
                if (userReact.First().React == -react)
                {
                    userReact.First().React = react;
                    var result = _reactionRepo.Update(userReact.First());
                    await _unitOfWork.CompleteAsync();
                    return result;
                }
                throw new Exception("Reaction type is wrong!");
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
