﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Web.Api.Data.Context;
using Web.Api.DTOs.ResponseModels;
using Web.Api.Entities;
using System.Linq;
using Web.Api.DTOs.RequestModels;
namespace Web.Api.Services.User
{
    public class UserService : IUserService
    {
        private readonly UserManager<Entities.User> _userManager;
        protected AppDbContext context;
        private IPasswordHasher<Entities.User> _passwordHasher;

        public UserService(UserManager<Entities.User> userManager, AppDbContext context, IPasswordHasher<Entities.User> passwordHasher)
        {
            _userManager = userManager;
            this.context = context;
            this._passwordHasher = passwordHasher;
        }

        public async Task<List<Entities.User>> GetAll()
        {
            try
            {
                var users = _userManager.Users.ToList();
                //https://www.youtube.com/watch?v=6JVZwwAf88k
                //var usersWithRoles = await context.Users 
                //    .Include(x => x.UserRoles)
                //    .ThenInclude(x => x.Role)
                //    .ToListAsync();
                
                return users;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Entities.User> GetById(Guid id)
        {
            try
            {
                var user = _userManager.FindByIdAsync(id.ToString());
                return user.Result;
            }
            catch(Exception)
            {
                throw;
            }
            
        }

        public async Task<Entities.User> UpdateAsync(Guid id, UserRequestModel user)
        {
            try
            {
                //Check user is existed
                var checkUser = await _userManager.FindByIdAsync(id.ToString());         
                if (checkUser == null)
                {
                    throw new Exception("Can not find the user");
                }
                var userUpdate = checkUser;
                //Check email and username is existed
                var users = _userManager.Users.ToList();
                foreach (var item in users)
                {
                    if(item.Id != id)
                    {
                        if (item.Email.ToLower().Trim() == user.Email.ToLower().Trim())
                        {
                            throw new Exception("The email has been used, please choose another email!");
                        }
                        if (item.UserName.ToLower().Trim() == user.UserName.ToLower().Trim())
                        {
                            throw new Exception("The username has been used, please choose another username!");
                        }
                    }
                }
                //Add update data
                userUpdate.UserName = user.UserName;
                userUpdate.Email = user.Email;
                userUpdate.Name = user.Name;
                userUpdate.PasswordHash = _passwordHasher.HashPassword(userUpdate, user.Password);
                userUpdate.Address = user.Address;
                userUpdate.DepartmentId = user.DepartmentId;
                userUpdate.PhoneNumber = user.PhoneNumber;
                //Validate and update role
                var userRole = await _userManager.GetRolesAsync(checkUser);
                if(user.Role != null)
                {
                    if (userRole.Any())
                    {
                        if (userRole[0].Trim().ToLower() != user.Role.Trim().ToLower())
                        {
                            await _userManager.RemoveFromRoleAsync(checkUser, userRole[0]);
                        }
                    }
                    await _userManager.AddToRoleAsync(userUpdate, user.Role);
                }
                //update user and their role
                var update = await _userManager.UpdateAsync(userUpdate);          
                if (!update.Succeeded)
                {
                    foreach(var e in update.Errors)
                    {
                        throw new Exception(e.Description); 
                    }
                }
                var result = await _userManager.FindByIdAsync(userUpdate.Id.ToString());
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IdentityResult> Delete(Guid id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    throw new Exception("Can not find the user!");
                }
                var result = await _userManager.DeleteAsync(user);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
